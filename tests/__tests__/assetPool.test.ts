import { assetDecorationMapper, AssetPool } from "../../src/assetPool";
import { AssetSorter } from "../../src/assetSorter";
import { InvalidArgumentError } from "../../src/errors/app.errors";
import { IAssetData, IMixParams } from "../../src/types";
import { setupFetchMock } from "../fetch.setup";
import {
  MOCK_ASSET_DATA,
  MOCK_TIMED_ASSET_DATA,
} from "../__mocks__/mock_api_responses";

describe("AssetPool", () => {
  setupFetchMock();
  describe("Instantiation", () => {
    it("should throw error if passed assets are not array", () => {
      expect.assertions(1);
      try {
        // @ts-expect-error
        const assetPool = new AssetPool({ assets: "string" });
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidArgumentError);
      }
    });

    it("shoud throw error if passed timedAssets are not an array", () => {
      expect.assertions(1);
      try {
        // @ts-expect-error
        const assetPool = new AssetPool({ timedAssets: "string" });
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidArgumentError);
      }
    });

    it("should create an instance", () => {
      const assetPool = new AssetPool({});
      expect(assetPool).toBeInstanceOf(AssetPool);
    });

    it("should update the assets by decorating with timedAssets and sorting", () => {
      const assetPool = new AssetPool({
        assets: MOCK_ASSET_DATA,
        timedAssets: MOCK_TIMED_ASSET_DATA,
        sortMethods: [],
        mixParams: {
          ordering: "by_like",
        },
      });

      const expectedData = MOCK_ASSET_DATA.map(
        assetDecorationMapper(MOCK_TIMED_ASSET_DATA)
      );
      assetPool.assetSorter.sort(expectedData);
      expect(assetPool.assets).toEqual(expectedData);
    });

    it("should set assetSorter with AssetSorter object", () => {
      const assetPool = new AssetPool({
        assets: MOCK_ASSET_DATA,
        timedAssets: MOCK_TIMED_ASSET_DATA,

        mixParams: {
          ordering: "by_like",
        },
      });
      const expectedAssetSorter = new AssetSorter({
        sortMethods: [],
        ordering: "by_like",
      });
      expect(assetPool.assetSorter).toEqual(expectedAssetSorter);
    });
  });

  describe("Methods", () => {
    const assetPool = new AssetPool({
      assets: MOCK_ASSET_DATA,
      timedAssets: MOCK_TIMED_ASSET_DATA,

      mixParams: {
        ordering: "by_like",
      },
    });

    it("should throw error is passed data is not array", () => {
      expect.assertions(1);
      try {
        // @ts-expect-error
        assetPool.updateAssets("string", "string1");
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidArgumentError);
      }
    });

    it("should decorate assets with timedAssets", () => {
      assetPool.assets = undefined;

      assetPool.updateAssets(MOCK_ASSET_DATA.reverse(), MOCK_TIMED_ASSET_DATA);
      expect(assetPool.assets).toEqual(
        MOCK_ASSET_DATA.map(assetDecorationMapper(MOCK_TIMED_ASSET_DATA))
      );
    });
  });
});
