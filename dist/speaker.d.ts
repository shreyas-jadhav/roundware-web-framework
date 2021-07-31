import { IApiClient } from "./types/api-client";
import { ISpeaker, ISpeakerData } from "./types/speaker";
export declare class Speaker implements ISpeaker {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, { apiClient }: {
        apiClient: IApiClient;
    });
    toString(): string;
    connect({ ...data }: {
        [x: string]: any;
    }): Promise<ISpeakerData[]>;
}
