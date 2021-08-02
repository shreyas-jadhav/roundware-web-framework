import { AssetPool } from "./assetPool";
import { Playlist } from "./playlist";
import { Roundware } from "./roundware";
import { SpeakerTrack } from "./speaker_track";
import { Coordinates, IMixParams } from "./types";
export declare const GeoListenMode: Readonly<{
    DISABLED: number;
    MANUAL: number;
    AUTOMATIC: number;
}>;
export declare class Mixer {
    playing: boolean;
    private _windowScope;
    private _client;
    private _prefetchSpeakerAudio;
    mixParams: IMixParams;
    playlist: Playlist | undefined;
    assetPool: AssetPool;
    speakerTracks: SpeakerTrack[];
    constructor({ client, windowScope, listenerLocation, prefetchSpeakerAudio, filters, sortMethods, mixParams, }: {
        client: Roundware;
        windowScope: Window;
        listenerLocation: Coordinates;
        prefetchSpeakerAudio: boolean | unknown;
        filters?: unknown[];
        sortMethods?: unknown[];
        mixParams: object;
    });
    updateParams({ listenerLocation, ...params }: IMixParams): void;
    /**
     * @param  {number} trackId
     */
    skipTrack(trackId: number): void;
    skip(): void;
    /**
     * @param  {number} trackId
     */
    replayTrack(trackId: number): void;
    /**
     * @returns string
     */
    toString(): string;
    initContext(): void;
    /**
     * @returns boolean - playing
     */
    toggle(): boolean;
}
//# sourceMappingURL=mixer.d.ts.map