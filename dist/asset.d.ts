import { ApiClient } from "./api-client";
export declare const PATH: string;
export declare class Asset {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, { apiClient }: {
        apiClient: ApiClient;
    });
    toString(): string;
    connect<T>(data?: {}): Promise<T>;
}
//# sourceMappingURL=asset.d.ts.map