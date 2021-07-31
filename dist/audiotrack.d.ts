import { IApiClient } from "./types/api-client";
import { IAudioTrack } from "./types/audioTrack";
import { IAudioTrackData } from "./types/audioTrack";
export declare class Audiotrack implements IAudioTrack {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, options: {
        apiClient: IApiClient;
    });
    toString(): string;
    connect(data?: any): Promise<IAudioTrackData[]>;
}
