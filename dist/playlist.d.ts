import { PlaylistAudiotrack } from "./playlistAudioTrack";
import { Point } from "@turf/helpers";
import { IAudioContext } from "standardized-audio-context";
import { IAudioTrackData } from "./types/audioTrack";
import { IMixParams } from "./types";
import { Roundware } from "./roundware";
import { AssetPool } from "./assetPool";
export declare class Playlist {
    listenerPoint: Point;
    playingTracks: IAudioTrackData[];
    assetPool: AssetPool;
    playing: boolean;
    listenTagIds: number[];
    _client: Roundware;
    _elapsedTimeMs: number;
    trackMap: Map<any, any>;
    trackIdMap: {};
    playlistLastStartedAt: Date | undefined;
    constructor({ client, audioTracks, listenerPoint, windowScope, assetPool, ...playlistTrackOptions }: {
        client: Roundware;
        audioTracks?: IAudioTrackData[];
        listenerPoint: Point;
        windowScope: Window;
        assetPool: AssetPool;
        audioContext?: IAudioContext;
    });
    get tracks(): any[];
    get currentlyPlayingAssets(): any[];
    updateParams({ listenerPoint, listenTagIds, ...params }: IMixParams): void;
    play(): void;
    skip(trackId?: number): void;
    replay(trackId: number): void;
    pause(): void;
    get elapsedTimeMs(): number;
    next(forTrack: PlaylistAudiotrack): import("./types").IAssetData | undefined;
}
//# sourceMappingURL=playlist.d.ts.map