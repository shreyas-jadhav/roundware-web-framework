import { IAssetData } from "./types";
/**
 Sort assets destructively, in random order.
 @note This is tricky to get right, uses a Fisher-Yates (aka Knuth) Shuffle. I copied this right out of Stack Overflow.
 @see https://stackoverflow.com/a/2450976/308448
 @see http://sedition.com/perl/javascript-fy.html
 */
export declare function sortRandomly(assetsArray: IAssetData[]): void;
/**
 Sort assets destructively, in descending order of assigned weight.
 */
export declare function sortByWeight(assetsArray: IAssetData[]): void;
/**
Sort assets destructively, in descending order of current number of likes.
@TODO Not implemented yet
*/
export declare function sortByLikes(assetsArray: IAssetData[]): void;
export declare function sortByProjectDefault(ordering: string): (assetArray: IAssetData[]) => void;
