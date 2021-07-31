import { Point } from "@turf/helpers";
import { IAudioContext } from "standardized-audio-context";
/**
 * @param  {string} url
 * @returns Cleaned URL
 */
export declare const cleanAudioURL: (url: string) => string;
/**
 * @param  {number} {latitude
 * @param  {number} longitude
 * @returns Point
 */
export declare function coordsToPoints({ latitude, longitude, }: {
    latitude: number;
    longitude: number;
}): Point;
export declare const isEmpty: (array: any[]) => boolean;
export declare const hasOwnProperty: (target: unknown, propName: PropertyKey) => boolean;
export declare const random: (a?: number, b?: number) => number;
export declare const randomInt: (a?: number, b?: number) => number;
export declare function buildAudioContext(windowScope: Window): IAudioContext;
export declare const timestamp: {
    toString: (time?: Date) => string;
};
export declare const getUrlParam: (urlStr: string, paramName: string) => string;
export declare const NO_OP: () => void;
