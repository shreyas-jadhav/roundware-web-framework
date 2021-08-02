import { IAudioTrackData } from "../types/audioTrack";
import { ITrackOptions } from "../types/mixer/TrackOptions";
export declare class TrackOptions implements ITrackOptions {
    volumeRange: number[];
    duration: number[];
    deadAir: number[];
    fadeInTime: number[];
    fadeOutTime: number[];
    repeatRecordings: boolean;
    tags: string[] | number[];
    bannedDuration: number;
    startWithSilence: boolean;
    fadeOutWhenFiltered: boolean;
    fadeOutMultiplier: number;
    constructor(urlParamLookup: (param: string) => string | number, params: IAudioTrackData);
    get randomVolume(): number;
    get randomDeadAir(): number;
    get randomFadeInDuration(): number;
    get randomFadeOutDuration(): number;
    get volumeRangeLowerBound(): number;
    get volumeRangeUpperBound(): number;
    get deadAirLowerBound(): number;
    get deadAirUpperBound(): number;
    get durationLowerBound(): number;
    get durationUpperBound(): number;
    get durationHalfway(): number;
    get fadeInLowerBound(): number;
    get fadeInUpperBound(): number;
    get fadeOutLowerBound(): number;
    get fadeOutUpperBound(): number;
}
//# sourceMappingURL=TrackOptions.d.ts.map