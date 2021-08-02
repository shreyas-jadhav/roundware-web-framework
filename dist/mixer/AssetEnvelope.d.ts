import { IAssetData } from "../types";
import { ITrackOptions } from "../types/mixer/TrackOptions";
export declare class AssetEnvelope {
    asset: IAssetData;
    assetId: string | number | undefined;
    minDuration: number;
    maxDuration: number;
    duration: number;
    start: number;
    fadeInDuration: number;
    fadeOutDuration: number;
    startFadingOutSecs: number;
    constructor(trackOptions: ITrackOptions, asset: IAssetData);
    toString(): string;
}
//# sourceMappingURL=AssetEnvelope.d.ts.map