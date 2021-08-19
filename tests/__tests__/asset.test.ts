import { ApiClient } from "../../src/api-client";
import { Asset } from "../../src/asset";
import {
  InvalidArgumentError,
  MissingArgumentError,
  RoundwareConnectionError,
} from "../../src/errors/app.errors";
import { setupFetchMock, setupFetchWhichThrowsError } from "../fetch.setup";
import { MOCK_ASSET_DATA } from "../__mocks__/mock_api_responses";
import config from "../__mocks__/roundware.config";

describe("Asset ", () => {
  setupFetchMock();

  describe("Instantiation", () => {
    it("should throw error is params not passed", () => {
      expect.assertions(1);
      try {
        // @ts-expect-error
        const asset = new Asset();
      } catch (e) {
        expect(e).toBeInstanceOf(MissingArgumentError);
      }
    });
    it("should throw invalid if projectId is not number", () => {
      expect.assertions(1);
      try {
        // @ts-expect-error
        const asset = new Asset("10");
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidArgumentError);
      }
    });

    it("should throw invalid if apiClient is not instance of apiClient", () => {
      expect.assertions(1);
      try {
        // @ts-expect-error
        const asset = new Asset(10, { apiClient: new Date() });
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidArgumentError);
      }
    });

    it("should create a Asset instance successfully", () => {
      const asset = new Asset(config.projectId, {
        apiClient: new ApiClient(config.baseServerUrl),
      });
      expect(asset).toBeInstanceOf(Asset);
    });
  });

  describe(".connect()", () => {
    const asset = new Asset(config.projectId, {
      apiClient: new ApiClient(config.baseServerUrl),
    });
    it("should connect to roundware server", async () => {
      expect.assertions(2);
      const data = await asset.connect();
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(
        "https://prod.roundware.com/api/2/assets/?method=GET&contentType=x-www-form-urlencoded&project_id=10",
        { headers: {}, method: "GET", mode: "cors" }
      );
    });

    it("throws error if connection fails", async () => {
      expect.assertions(1);
      setupFetchWhichThrowsError();
      try {
        await asset.connect();
      } catch (e) {
        expect(e).toBeInstanceOf(RoundwareConnectionError);
      }
      setupFetchMock();
    });
    it("return assets data", async () => {
      const data = await asset.connect();
      expect(data).toEqual(MOCK_ASSET_DATA);
    });
    it("should fetch assets with given data", async () => {
      const data = await asset.connect({
        latitude: 42.4986343383789,
      });
      expect(data).toEqual(
        MOCK_ASSET_DATA.filter((asset) => asset.latitude == 42.4986343383789)
      );
    });
  });

  it(".toString() returns expected string", () => {
    const asset = new Asset(config.projectId, {
      apiClient: new ApiClient(config.baseServerUrl),
    });
    expect(asset.toString()).toEqual(`Roundware Assets (#${config.projectId})`);
  });
});
