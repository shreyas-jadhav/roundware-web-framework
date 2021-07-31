import { IAssetData, IAssetSorter } from "./types";
export declare class AssetSorter implements IAssetSorter {
    sortMethods: ((assetsArray: any) => void)[];
    constructor({ sortMethods, ordering, }: {
        sortMethods: any[];
        ordering: string;
    });
    sort(assets: IAssetData[]): void;
}
