import { ApiClient } from "../../src/api-client";
import { Asset } from "../../src/asset";
import {
  InvalidArgumentError,
  MissingArgumentError,
} from "../../src/errors/app.errors";
import { setupFetchMock } from "../fetch.setup";
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
});
