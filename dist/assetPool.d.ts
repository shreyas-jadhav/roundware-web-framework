import { AssetSorter } from "./assetSorter";
import { Point } from "@turf/helpers";
import { IAssetData, IMixParams, ITimedAssetData, ITrack } from "./types";
export declare class AssetPool {
    assetSorter: AssetSorter;
    playingTracks: {};
    mixParams: {};
    filterChain: CallableFunction;
    assets: IAssetData[];
    constructor({ assets, timedAssets, filterChain, sortMethods, mixParams, }: {
        assets: IAssetData[];
        timedAssets: ITimedAssetData[];
        filterChain: CallableFunction;
        sortMethods: unknown[];
        mixParams: IMixParams;
    });
    updateAssets(assets?: IAssetData[], timedAssets?: ITimedAssetData[]): void;
    nextForTrack(track: ITrack, { elapsedSeconds: number, filterOutAssets, ...stateParams }: {
        elapsedSeconds: number;
        listenerPoint?: Point;
        listenTagIds?: number[];
        filterOutAssets: IAssetData[];
    }): IAssetData | undefined;
    sortAssets(): void;
    add(asset: IAssetData): void;
}
//# sourceMappingURL=assetPool.d.ts.map