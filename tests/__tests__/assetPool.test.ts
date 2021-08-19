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

    it("should create an instance", () => {
      const assetPool = new AssetPool({});
      expect(assetPool).toBeInstanceOf(AssetPool);
    });

    // it("should update the assets", () => {
    //   const mockFilterChain = (asset: IAssetData, mixParams: IMixParams) => 1;
    //   const assetPool = new AssetPool({
    //     assets: MOCK_ASSET_DATA,
    //     timedAssets: MOCK_TIMED_ASSET_DATA,
    //     filterChain: mockFilterChain,
    //   });

    //   expect(assetPool.assets).toEqual(
    //     MOCK_ASSET_DATA.map(assetDecorationMapper(MOCK_TIMED_ASSET_DATA))
    //   );
    //   expect(assetPool.assetSorter).toBe(new AssetSorter({ sortMethods: [] }));
    // });
  });
});
