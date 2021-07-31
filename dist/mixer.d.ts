import { IAssetPool } from "./types/assetPool";
import { IRoundware } from "./types/roundware";
import { Coordinates, IMixParams } from "./types";
import { IMixer } from "./types/mixer";
import { ISpeakerTrack } from "./types/speaker-track";
import { IPlaylist } from "./types/playlist";
export declare const GeoListenMode: Readonly<{
    DISABLED: number;
    MANUAL: number;
    AUTOMATIC: number;
}>;
export declare class Mixer implements IMixer {
    playing: boolean;
    private _windowScope;
    private _client;
    private _prefetchSpeakerAudio;
    mixParams: IMixParams;
    playlist: IPlaylist | undefined;
    assetPool: IAssetPool;
    speakerTracks: ISpeakerTrack[];
    constructor({ client, windowScope, listenerLocation, prefetchSpeakerAudio, filters, sortMethods, mixParams, }: {
        client: IRoundware;
        windowScope: Window;
        listenerLocation: Coordinates;
        prefetchSpeakerAudio: boolean | unknown;
        filters?: unknown[];
        sortMethods?: unknown[];
        mixParams: object;
    });
    updateParams({ listenerLocation, ...params }: IMixParams): void;
    skipTrack(trackId: number): void;
    skip(): void;
    replayTrack(trackId: number): void;
    toString(): string;
    initContext(): void;
    toggle(): boolean;
}
