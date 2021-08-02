import { ApiClient } from "./api-client";
import { IAudioTrackData } from "./types/audioTrack";
export declare class Audiotrack {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, options: {
        apiClient: ApiClient;
    });
    toString(): string;
    connect(data?: any): Promise<IAudioTrackData[]>;
}
//# sourceMappingURL=audiotrack.d.ts.map