import { TrackOptions } from "./mixer/TrackOptions";
import { IAudioContext, IGainNode } from "standardized-audio-context";
import { IAssetData, IMixParams } from "./types";
import { IAudioTrackData } from "./types/audioTrack";
import { Playlist } from "./playlist";
import { ITrackStates } from "./types/track-states";
export declare class PlaylistAudiotrack {
    trackId: any;
    timedAssetPriority: any;
    playlist: Playlist;
    playing: boolean;
    windowScope: Window;
    currentAsset: IAssetData | undefined;
    audioContext: IAudioContext;
    audioElement: HTMLAudioElement;
    gainNode: IGainNode<IAudioContext> | undefined;
    trackOptions: TrackOptions;
    mixParams: IMixParams;
    state: ITrackStates | undefined;
    constructor({ audioContext, windowScope, audioData, playlist, }: {
        audioContext: IAudioContext;
        windowScope: Window;
        audioData: IAudioTrackData;
        playlist: Playlist;
    });
    setInitialTrackState(): void;
    onAudioError(evt?: any): void;
    onAudioEnded(): void;
    play(): void;
    updateParams(params?: {}): void;
    holdGain(): void;
    setZeroGain(): void;
    fadeIn(fadeInDurationSeconds: number): boolean;
    rampGain(finalVolume: number, durationSeconds: number, rampMethod?: string): boolean | undefined;
    fadeOut(fadeOutDurationSeconds: number): boolean | undefined;
    loadNextAsset(): IAssetData | false | null;
    pause(): void;
    playAudio(): void;
    pauseAudio(): void;
    skip(): void;
    replay(): void;
    transition(newState: ITrackStates): void;
    toString(): string;
}
//# sourceMappingURL=playlistAudioTrack.d.ts.map