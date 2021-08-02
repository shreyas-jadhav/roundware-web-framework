import { IAssetData } from "./types";
export declare class AssetSorter {
    sortMethods: ((assetsArray: any) => void)[];
    constructor({ sortMethods, ordering, }: {
        sortMethods: any[];
        ordering: string;
    });
    sort(assets: IAssetData[]): void;
}
//# sourceMappingURL=assetSorter.d.ts.map