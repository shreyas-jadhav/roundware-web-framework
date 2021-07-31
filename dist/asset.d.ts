import { IApiClient } from "./types/api-client";
import { IAsset } from "./types/asset";
export declare const PATH: string;
export declare class Asset implements IAsset {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, { apiClient }: {
        apiClient: IApiClient;
    });
    toString(): string;
    connect<T>(data?: {}): Promise<T>;
}
