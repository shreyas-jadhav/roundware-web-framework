import { PlaylistAudiotrack } from "./playlistAudioTrack";
import { IAssetData } from "./types";
import { IAssetEnvelope } from "./types/mixer/AssetEnvelope";
import { ITrackOptions } from "./types/mixer/TrackOptions";
import { ICommonStateProperties } from "./types/track-states";
/**
 Common sequence of states:
 Silence => FadingIn => PlayingAsset => FadingOut => Silence
 */
export declare class LoadingState implements ICommonStateProperties {
    track: PlaylistAudiotrack;
    trackOptions: ITrackOptions;
    asset: IAssetData | null;
    constructor(track: PlaylistAudiotrack, trackOptions: ITrackOptions);
    play(): void;
    pause(): void;
    finish(): void;
    skip(): void;
    replay(): void;
    updateParams(): void;
    toString(): string;
}
export declare class TimedTrackState implements ICommonStateProperties {
    track: PlaylistAudiotrack;
    windowScope: Window;
    trackOptions: ITrackOptions;
    timerId: null | number;
    timeRemainingMs?: number;
    timerApproximateEndingAtMs?: number;
    constructor(track: PlaylistAudiotrack, trackOptions: ITrackOptions);
    /**
     * @param  {number=0} nextStateSecs
     * @returns number
     */
    play(nextStateSecs?: number): number | void;
    /**
     */
    pause(): void;
    clearTimer(): number;
    finish(): void;
    setNextStateTimer(timeMs: number): void;
    setNextState(): void;
    skip(): void;
    replay(): void;
    setLoadingState(): void;
    updateParams(params: object): void;
}
export declare class DeadAirState extends TimedTrackState implements ICommonStateProperties {
    deadAirSeconds: any;
    constructor(track: any, trackOptions: ITrackOptions);
    play(): any;
    setNextState(): void;
    toString(): string;
    updateParams(): void;
}
export declare class FadingInState extends TimedTrackState implements ICommonStateProperties {
    assetEnvelope: any;
    constructor(track: any, trackOptions: ITrackOptions, { assetEnvelope }: {
        assetEnvelope: IAssetEnvelope;
    });
    play(): any;
    pause(): void;
    setNextState(): void;
    toString(): string;
}
export declare class PlayingState extends TimedTrackState implements ICommonStateProperties {
    assetEnvelope: any;
    constructor(track: any, trackOptions: any, { assetEnvelope }: any);
    play(): any;
    pause(): void;
    toString(): string;
    setNextState(): void;
}
export declare class FadingOutState extends TimedTrackState implements ICommonStateProperties {
    assetEnvelope: any;
    constructor(track: PlaylistAudiotrack, trackOptions: ITrackOptions, { assetEnvelope }: {
        assetEnvelope: IAssetEnvelope;
    });
    play(): void;
    pause(): void;
    setNextState(): void;
    toString(): string;
}
export declare class WaitingForAssetState extends TimedTrackState implements ICommonStateProperties {
    constructor(track: PlaylistAudiotrack, trackOptions: ITrackOptions);
    play(): void;
    updateParams(params?: {}): void;
    setNextState(): void;
    toString(): string;
}
export declare const makeInitialTrackState: (track: PlaylistAudiotrack, trackOptions: ITrackOptions) => LoadingState | DeadAirState;
//# sourceMappingURL=TrackStates.d.ts.map