import { ApiClient } from "./api-client";
import { ISpeakerData } from "./types/speaker";
export declare class Speaker {
    private _projectId;
    private _apiClient;
    constructor(projectId: number, { apiClient }: {
        apiClient: ApiClient;
    });
    toString(): string;
    connect({ ...data }: {
        [x: string]: any;
    }): Promise<ISpeakerData[]>;
}
//# sourceMappingURL=speaker.d.ts.map