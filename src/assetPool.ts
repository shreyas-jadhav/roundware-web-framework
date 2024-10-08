import { union } from "lodash";
import { AssetPriorityType, roundwareDefaultFilterChain } from "./assetFilters";
import { AssetSorter } from "./assetSorter";
import { InvalidArgumentError } from "./errors/app.errors";
import { PlaylistAudiotrack } from "./playlistAudioTrack";
import { ILookupTable, IMixParams, ITimedAssetData } from "./types";
import { IAssetData, IDecoratedAsset } from "./types/asset";
import { cleanAudioURL, coordsToPoints } from "./utils";

export class AssetPool {
  assetSorter: AssetSorter;
  playingTracks: {};
  mixParams: IMixParams;
  filterChain: (
    asset: IDecoratedAsset,
    mixParams: IMixParams
  ) => AssetPriorityType;
  assets: IDecoratedAsset[] = [];

  constructor({
    assets = [],
    timedAssets = [],
    filterChain = roundwareDefaultFilterChain,
    sortMethods = [],
    mixParams = {},
  }: {
    assets?: IAssetData[];
    timedAssets?: ITimedAssetData[];
    filterChain?: (
      asset: IDecoratedAsset,
      mixParams: IMixParams
    ) => AssetPriorityType;
    sortMethods?: string[];
    mixParams?: IMixParams;
  }) {
    this.assetSorter = new AssetSorter({
      sortMethods,
      ...mixParams,
    });
    this.playingTracks = {};
    this.mixParams = mixParams;
    this.filterChain = filterChain;
    this.updateAssets(assets, timedAssets);
    this.sortAssets();
  }

  updateAssets(assets: IAssetData[] = [], timedAssets: ITimedAssetData[] = []) {
    if (!Array.isArray(assets) || !Array.isArray(timedAssets)) {
      throw new InvalidArgumentError(
        "assets/timedAssets",
        "array",
        "updateAssets() in AssetPool"
      );
    }

    let newAssets = assets.map(assetDecorationMapper(timedAssets));
    // preserve the existing properties of assets, add instead of replacing...

    newAssets.forEach((asset) => {
      if (!this.assets.some((a) => a.id === asset.id)) this.add(asset);
    });
  }

  nextForTrack(
    track: PlaylistAudiotrack,
    {
      elapsedSeconds,
      filterOutAssets = [],
      listenTagIds = [],
      ...stateParams
    }: {
      elapsedSeconds: number;
      listenerPoint?: IMixParams[`listenerPoint`];
      listenTagIds?: IMixParams[`listenTagIds`];
      filterOutAssets: IAssetData[];
    }
  ): IDecoratedAsset | undefined {
    const mixParams: IMixParams = {
      ...this.mixParams,
      ...track.mixParams,
      ...stateParams,
      listenTagIds: union(
        this.mixParams.listenTagIds,
        track.mixParams?.listenTagIds,
        listenTagIds
      ),
      ...track.trackOptions,
    };

    interface IRankedAssets {
      [rank: number]: IDecoratedAsset[];
    }
    const rankedAssets = this.assets.reduce(
      (rankings: IRankedAssets, asset) => {
        if (filterOutAssets.includes(asset)) return rankings;

        const rank = this.filterChain(asset, mixParams);

        if (rank !== false) {
          rankings[rank] = rankings[rank] || [];
          rankings[rank].push(asset);
        }
        return rankings;
      },
      {}
    );

    const rankingGroups = Object.keys(rankedAssets).map((a) =>
      Number.parseInt(a)
    );

    if (Array.isArray(rankingGroups) && rankingGroups.length < 1) {
      console.warn("All assets filtered out");
      return;
    }

    const topPriorityRanking = rankingGroups.sort()[0];

    // play least-recently played assets first

    const priorityAssets: IDecoratedAsset[] =
      rankedAssets[topPriorityRanking] || [];

    // this.assetSorter.sort(priorityAssets);
    priorityAssets.sort((a, b) => b.playCount - a.playCount);

    const nextAsset = priorityAssets.pop();
    // if new asset is not an asset which was paused previously
    // then release all the paused assets
    if (!mixParams.keepPausedAssets) {
      if (nextAsset?.status !== "resumed") {
        this.assets.forEach((a) => {
          if (a.status === "paused" && a.pausedFromTrackId === track.trackId) {
            track.pausedAssetId = null;
            a.status = undefined;
            a.playCount++;
          }
        });
      }
    }
    return nextAsset;
  }

  sortAssets() {
    this.assetSorter.sort(this.assets);
  }

  add(asset: IDecoratedAsset) {
    this.assets.push(asset);
    this.sortAssets();
  }
}

export default AssetPool;

// add new fields to assets after they have been downloaded from the API to be used by rest of the mixing code
// also rewrite .wav as .mp3
export function assetDecorationMapper(timedAssets: ITimedAssetData[]) {
  const timedAssetLookup = timedAssets.reduce(
    (lookupTable: ILookupTable, timedAsset: ITimedAssetData) => ({
      ...lookupTable,
      [timedAsset.asset_id]: timedAsset,
    }),
    {}
  );

  return (asset: IAssetData): IDecoratedAsset => {
    const {
      start_time: activeRegionLowerBound = 0,
      end_time: activeRegionUpperBound = 0,
      file: assetUrl,
    } = asset;

    const activeRegionLength = activeRegionUpperBound - activeRegionLowerBound;

    // per Halsey we should always use mp3s; also we avoid specifying http/https to avoid mixed-content warnings
    if (!assetUrl) console.warn(`assetUrl was undefined!`);
    const mp3Url = cleanAudioURL(assetUrl!);

    const decoratedAsset: IDecoratedAsset = {
      locationPoint: coordsToPoints({
        latitude: asset.latitude!,
        longitude: asset.longitude!,
      }),
      playCount: 0,
      activeRegionLength,
      activeRegionUpperBound,
      activeRegionLowerBound,
      ...asset,
      created: asset.created ? new Date(asset.created) : new Date(),
      file: mp3Url,
    };

    const timedAsset = timedAssetLookup[asset.id!];

    if (timedAsset) {
      decoratedAsset.timedAssetStart = timedAsset.start!;
      decoratedAsset.timedAssetEnd = timedAsset.end!;
    }

    return decoratedAsset;
  };
}
