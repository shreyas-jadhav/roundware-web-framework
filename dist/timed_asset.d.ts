import { ITimedAsset, ITimedAssetData } from "./types";
import { IApiClient } from "./types/api-client";
export declare class TimedAsset implements ITimedAsset {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, { apiClient }: {
        apiClient: IApiClient;
    });
    toString(): string;
    connect({ ...data }: {
        [x: string]: any;
    }): Promise<ITimedAssetData[]>;
}
