import * as localforage from "localforage";
import { ApiClient } from "./api-client";
import {
  InvalidArgumentError,
  MissingArgumentError,
} from "./errors/app.errors";
import { IAssetData } from "./types/asset";
import { IAssetFilters } from "./types/asset";

/* global process */
export const PATH =
  process.env.NODE_ENV === "development"
    ? "/assets/?created__lte=2019-08-15T18:06:39"
    : "/assets/";

export class Asset {
  private _projectId: number;
  private _apiClient: ApiClient;
  constructor(projectId: number, options: { apiClient: ApiClient }) {
    if (typeof projectId == "undefined")
      throw new MissingArgumentError(
        "projectId",
        "instantiating Asset",
        "number"
      );
    if (typeof projectId !== "number")
      throw new InvalidArgumentError(
        "projectId",
        "number",
        "instantiating Asset"
      );
    if (options.apiClient instanceof ApiClient)
      this._apiClient = options.apiClient;
    else
      throw new InvalidArgumentError(
        "apiClient",
        "ApiClient",
        "instantiating Asset"
      );
    this._projectId = projectId;
  }

  toString(): string {
    return `Roundware Assets (#${this._projectId})`;
  }

  async connect(data: IAssetFilters = {}): Promise<IAssetData[]> {
    // 1. check if data exists in localforage
    // 2. check last fetched data
    // 3. make new request with created_gte as last fetch
    // 4. concat with stored asset data
    // 5. update last fetched in localforage

    let options: IAssetFilters = { ...data, project_id: this._projectId };

    if (!options.created__gte) {
      const lastUpdated = await localforage.getItem<string>("assetLastUpdated");
      if (lastUpdated) {
        options = {
          ...options,
          created__gte: lastUpdated,
        };
      }
      const assetData = await this._apiClient.get<IAssetData[]>(PATH, options);
      return await this.updateLocalAssetData(assetData);
    }

    const assetData = await this._apiClient.get<IAssetData[]>(PATH, options);
    this.updateLocalAssetData(assetData);
    return assetData;
  }

  async updateLocalAssetData(assetData: IAssetData[]): Promise<IAssetData[]> {
    const storageAssetData = await localforage.getItem("assetData");
    if (Array.isArray(storageAssetData)) {
      assetData.forEach((asset) => {
        if (!storageAssetData.some((a) => a.id === asset.id))
          storageAssetData.push(asset);
      });
      await localforage.removeItem("assetData");
      await localforage.setItem("assetData", storageAssetData);
      console.info("cached asset data!");
    } else await localforage.setItem("assetData", assetData);
    await localforage.setItem("assetLastUpdated", new Date().toISOString());
    return (await localforage.getItem("assetData")) || assetData;
  }
}
