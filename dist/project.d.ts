import { IApiClient } from "./types/api-client";
import { Coordinates, IProject, UiConfig } from "./types";
export declare class Project implements IProject {
    projectId: number;
    projectName: string;
    apiClient: IApiClient;
    legalAgreement: unknown;
    recordingRadius: unknown;
    maxRecordingLength: unknown;
    location: Coordinates;
    mixParams: {};
    constructor(newProjectId: number, { apiClient }: {
        apiClient: IApiClient;
    });
    toString(): string;
    connect(sessionId: string): Promise<string | undefined>;
    uiconfig(sessionId: string): Promise<UiConfig>;
}
