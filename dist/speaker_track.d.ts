import { IAudioContext, IGainNode } from "standardized-audio-context";
import { Coord, Feature, LineString, Point } from "@turf/helpers";
import { PrefetchAudioType } from "./types";
import { MultiPolygon } from "@turf/helpers";
import { Polygon } from "@turf/helpers";
import { ISpeakerData } from "./types/speaker";
/** A Roundware speaker under the control of the client-side mixer, representing 'A polygonal geographic zone within which an ambient audio stream broadcasts continuously to listeners.
 * Speakers can overlap, causing their audio to be mixed together accordingly.  Volume attenuation happens linearly over a specified distance from the edge of the Speaker’s defined zone.'
 * (quoted from https://github.com/loafofpiecrust/roundware-ios-framework-v2/blob/client-mixing/RWFramework/RWFramework/Playlist/Speaker.swift)
 * */
export declare class SpeakerTrack {
    prefetch: PrefetchAudioType;
    audioContext: IAudioContext;
    speakerId: string;
    maxVolume: number;
    minVolume: number;
    attenuationDistanceKm: number;
    uri: string;
    listenerPoint: Point;
    playing: boolean;
    attenuationBorderPolygon: Feature<MultiPolygon, {
        [name: string]: any;
    }> | Feature<Polygon, {
        [name: string]: any;
    }>;
    attenuationBorderLineString: Feature<LineString, {
        [name: string]: any;
    }>;
    outerBoundary: Feature<MultiPolygon, {
        [name: string]: any;
    }> | Feature<Polygon, {
        [name: string]: any;
    }>;
    currentVolume: number;
    audio: HTMLAudioElement | undefined;
    gainNode: IGainNode<IAudioContext> | undefined;
    constructor({ audioContext, listenerPoint, prefetchAudio, data, }: {
        audioContext: IAudioContext;
        listenerPoint: Point;
        prefetchAudio: PrefetchAudioType;
        data: ISpeakerData;
    });
    outerBoundaryContains(point: Coord): boolean;
    attenuationShapeContains(point: Coord): boolean;
    attenuationRatio(atPoint: Coord): number;
    calculateVolume(): number;
    buildAudio(): Promise<HTMLAudioElement>;
    updateParams(isPlaying: boolean, opts: {
        listenerPoint: {
            geometry: Point;
        };
    }): Promise<void>;
    updateVolume(): Promise<number>;
    get logline(): string;
    play(): Promise<void>;
    pause(): Promise<void>;
    toString(): string;
}
//# sourceMappingURL=speaker_track.d.ts.map