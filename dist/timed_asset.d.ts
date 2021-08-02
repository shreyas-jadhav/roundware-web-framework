import { ITimedAssetData } from "./types";
import { ApiClient } from "./api-client";
export declare class TimedAsset {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, { apiClient }: {
        apiClient: ApiClient;
    });
    toString(): string;
    /**
     * @param  {object} {...data}
     * @returns Promise<ITimedAssetData[]>
     */
    connect({ ...data }: object | undefined): Promise<ITimedAssetData[]>;
}
//# sourceMappingURL=timed_asset.d.ts.map