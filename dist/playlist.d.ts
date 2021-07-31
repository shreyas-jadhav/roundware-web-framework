import { IPlaylist } from "./types/playlist";
import { IRoundware } from "./types/roundware";
import { Point } from "@turf/helpers";
import { IAssetPool } from "./types/assetPool";
import { IAudioContext } from "standardized-audio-context";
import { IAudioTrackData } from "./types/audioTrack";
import { ITrack } from "./types";
export declare class Playlist implements IPlaylist {
    listenerPoint: Point;
    playingTracks: IAudioTrackData[];
    assetPool: IAssetPool;
    playing: boolean;
    listenTagIds: number[];
    _client: IRoundware;
    _elapsedTimeMs: number;
    trackMap: Map<any, any>;
    trackIdMap: {};
    playlistLastStartedAt: Date | undefined;
    constructor({ client, audioTracks, listenerPoint, windowScope, assetPool, ...playlistTrackOptions }: {
        client: IRoundware;
        audioTracks?: IAudioTrackData[];
        listenerPoint: Point;
        windowScope: Window;
        assetPool: IAssetPool;
        audioContext?: IAudioContext;
    });
    get tracks(): any[];
    get currentlyPlayingAssets(): any[];
    updateParams({ listenerPoint, listenTagIds, ...params }: {
        listenerPoint: Point;
        listenTagIds: number[];
    }): void;
    play(): void;
    skip(trackId?: number): void;
    replay(trackId: number): void;
    pause(): void;
    get elapsedTimeMs(): number;
    next(forTrack: ITrack): import("./types").IAssetData | undefined;
}
