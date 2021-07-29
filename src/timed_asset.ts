import { ITimedAsset, ITimedAssetData } from "./types";
import { IApiClient } from "./types/api-client";

const PATH = "/timedassets/";

export class TimedAsset implements ITimedAsset {
  private _projectId: number;
  private _apiClient: IApiClient;

  constructor(projectId: number, { apiClient }: { apiClient: IApiClient }) {
    this._projectId = projectId;
    this._apiClient = apiClient;
  }

  toString() {
    return `Roundware TimedAssets (#${this._projectId})`;
  }

  async connect({ ...data }) {
    const options = { ...data, project_id: this._projectId };
    return await this._apiClient.get<ITimedAssetData[]>(PATH, options);
  }
}
