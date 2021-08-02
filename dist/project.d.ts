import { Coordinates, IUiConfig } from "./types";
import { ApiClient } from "./api-client";
export declare class Project {
    projectId: number;
    projectName: string;
    apiClient: ApiClient;
    legalAgreement: unknown;
    recordingRadius: unknown;
    maxRecordingLength: unknown;
    location: Coordinates;
    mixParams: {};
    constructor(newProjectId: number, { apiClient }: {
        apiClient: ApiClient;
    });
    toString(): string;
    /**
     * @param  {number} sessionId
     * @returns {Promise} sessionId | undefined
     */
    connect(sessionId: number): Promise<number | undefined>;
    /**
     * @param  {number} sessionId
     * @returns Promise<IUiConfig>
     */
    uiconfig(sessionId: number): Promise<IUiConfig>;
}
//# sourceMappingURL=project.d.ts.map