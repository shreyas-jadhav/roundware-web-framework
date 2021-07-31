import { AssetSorter } from "./assetSorter";
import { IAssetData, IMixParams, TimedAssetT, ITrack } from "./types";
import { IAssetPool } from "./types/assetPool";
import { ITimedAssetData } from "./types";
export declare class AssetPool implements IAssetPool {
    assetSorter: AssetSorter;
    playingTracks: {};
    mixParams: {};
    filterChain: CallableFunction;
    assets: IAssetData[];
    constructor({ assets, timedAssets, filterChain, sortMethods, mixParams, }: {
        assets: IAssetData[];
        timedAssets: TimedAssetT[];
        filterChain: CallableFunction;
        sortMethods: unknown[];
        mixParams: IMixParams;
    });
    updateAssets(assets?: IAssetData[], timedAssets?: ITimedAssetData[]): void;
    nextForTrack(track: ITrack, { elapsedSeconds: number, filterOutAssets, ...stateParams }: {
        elapsedSeconds: number;
        filterOutAssets: IAssetData[];
    }): IAssetData | undefined;
    sortAssets(): void;
    add(asset: IAssetData): void;
}
