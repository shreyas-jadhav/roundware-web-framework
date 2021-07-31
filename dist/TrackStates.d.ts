import { IAudioTrack } from "./types/audioTrack";
import { ITrackOptions } from "./types/mixer/TrackOptions";
import { IDeadAirState, ILoadingState, ITimedTrackState } from "./types/track-states";
/**
 Common sequence of states:
 Silence => FadingIn => PlayingAsset => FadingOut => Silence
 */
export declare class LoadingState implements ILoadingState {
    track: any;
    trackOptions: ITrackOptions;
    asset: null;
    constructor(track: IAudioTrack, trackOptions: ITrackOptions);
    play(): void;
    pause(): void;
    finish(): void;
    skip(): void;
    replay(): void;
    updateParams(): void;
    toString(): string;
}
declare class TimedTrackState implements ITimedTrackState {
    track: any;
    windowScope: any;
    trackOptions: any;
    timerId: null;
    timeRemainingMs: number | undefined;
    timerApproximateEndingAtMs: any;
    constructor(track: any, trackOptions: any);
    play(nextStateSecs?: number): number | void;
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
declare class DeadAirState extends TimedTrackState implements IDeadAirState {
    deadAirSeconds: any;
    constructor(track: any, trackOptions: ITrackOptions);
    play(): any;
    setNextState(): void;
    toString(): string;
    updateParams(): void;
}
export declare const makeInitialTrackState: (track: any, trackOptions: any) => DeadAirState | LoadingState;
export {};
