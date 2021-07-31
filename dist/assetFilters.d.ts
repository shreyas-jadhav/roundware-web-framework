import { Point } from "@turf/helpers";
import { IAssetData } from "./types";
export declare const ASSET_PRIORITIES: Readonly<{
    DISCARD: boolean;
    NEUTRAL: number;
    LOWEST: number;
    NORMAL: number;
    HIGHEST: number;
    [key: string]: boolean | number;
}>;
/** Filter composed of multiple inner filters that accepts assets which pass every inner filter. */
export declare function allAssetFilter(filters: ((asset: IAssetData, param: object) => boolean | number)[] | undefined, { ...mixParams }: {
    [x: string]: any;
}): (asset: IAssetData, { ...stateParams }: {
    [x: string]: any;
}) => number | boolean;
/** Only accepts an asset if the user is within the project-configured recording radius  */
export declare const distanceFixedFilter: () => (asset: IAssetData, options: {
    geoListenMode: number;
    listenerPoint: Point;
    recordingRadius: number;
}) => number | boolean;
/**
 Accepts an asset if the user is within range of it based on the current dynamic distance range.
 */
export declare const distanceRangesFilter: (asset: IAssetData, options: {
    getListenMode: number;
    listenerPoint: Point;
    minDist: number;
    maxDist: number;
}) => number | boolean;
export declare function anyTagsFilter(): (asset: IAssetData, { listenTagIds }: {
    listenTagIds: string[];
}) => number | boolean;
export declare function timedAssetFilter(): (asset: IAssetData, { elapsedSeconds, timedAssetPriority }: {
    elapsedSeconds?: number | undefined;
    timedAssetPriority?: string | undefined;
}) => number | boolean;
export declare function assetShapeFilter(): (asset: IAssetData, options: {
    listenerPoint: Point;
    geoListenMode: string | number;
}) => number | boolean;
export declare const timedRepeatFilter: () => (asset: IAssetData, { bannedDuration }: {
    bannedDuration?: number | undefined;
}) => number | boolean;
export declare const dateRangeFilter: () => (asset: IAssetData, { startDate, endDate }: {
    startDate: Date;
    endDate: Date;
}) => number | boolean;
export declare const roundwareDefaultFilterChain: (asset: IAssetData, { ...stateParams }: {
    [x: string]: any;
}) => number | boolean;
