import { assetDecorationMapper, AssetPool } from "../../src/assetPool";
import { AssetSorter } from "../../src/assetSorter";
import { InvalidArgumentError } from "../../src/errors/app.errors";
import { IAssetData, IMixParams } from "../../src/types";
import { coordsToPoints } from "../../src/utils";
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

    describe("#updateAssets()", () => {
      it("should throw error is passed data is not array", () => {
        expect.assertions(1);
        try {
          // @ts-expect-error
          assetPool.updateAssets("string", "string1");
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidArgumentError);
        }
      });

      let DECORATED_ASSETS = [
        {
          locationPoint: coordsToPoints({
            latitude: 1,
            longitude: 1,
          }),
          playCount: 0,
          activeRegionLength: 7.407,
          activeRegionUpperBound: 7.407,
          activeRegionLowerBound: 0,
          id: 5936,
          description: "",
          latitude: 1,
          longitude: 1,
          shape: null,
          filename: "20150119-113758-18467.wav",
          file: "//prod.roundware.com/rwmedia/20150119-113758-18467.mp3",
          volume: 1,
          submitted: true,
          created: new Date("2015-01-19T06:07:59.000Z"),
          updated: "2015-01-19T11:37:59",
          weight: 50,
          start_time: 0,
          end_time: 7.407,
          user: null,
          media_type: "audio",
          audio_length_in_seconds: 7.41,
          tag_ids: [92],
          session_id: 18467,
          project_id: 10,
          language_id: 1,
          envelope_ids: [3392],
          description_loc_ids: [],
          alt_text_loc_ids: [],
        },
        {
          locationPoint: coordsToPoints({
            latitude: 42.4987144470215,
            longitude: -71.2809524536133,
          }),
          playCount: 0,
          activeRegionLength: 3.436,
          activeRegionUpperBound: 3.436,
          activeRegionLowerBound: 0,
          id: 5935,
          description: "",
          latitude: 42.4987144470215,
          longitude: -71.2809524536133,
          shape: null,
          filename: "20150117-231843-18447.wav",
          file: "//prod.roundware.com/rwmedia/20150117-231843-18447.mp3",
          volume: 1,
          submitted: true,
          created: new Date("2015-01-17T17:48:44.000Z"),
          updated: "2015-01-17T23:18:44",
          weight: 50,
          start_time: 0,
          end_time: 3.436,
          user: null,
          media_type: "audio",
          audio_length_in_seconds: 3.44,
          tag_ids: [92],
          session_id: 18447,
          project_id: 10,
          language_id: 1,
          envelope_ids: [3390],
          description_loc_ids: [],
          alt_text_loc_ids: [],
        },
        {
          locationPoint: coordsToPoints({
            latitude: 42.4986343383789,
            longitude: -71.2810440063477,
          }),
          playCount: 0,
          activeRegionLength: 11.284,
          activeRegionUpperBound: 11.284,
          activeRegionLowerBound: 0,
          id: 5934,
          description: "",
          latitude: 42.4986343383789,
          longitude: -71.2810440063477,
          shape: null,
          filename: "20150117-231643-18447.wav",
          file: "//prod.roundware.com/rwmedia/20150117-231643-18447.mp3",
          volume: 1,
          submitted: true,
          created: new Date("2015-01-17T17:46:44.000Z"),
          updated: "2015-01-17T23:16:44",
          weight: 50,
          start_time: 0,
          end_time: 11.284,
          user: null,
          media_type: "audio",
          audio_length_in_seconds: 11.28,
          tag_ids: [91],
          session_id: 18447,
          project_id: 10,
          language_id: 1,
          envelope_ids: [3389],
          description_loc_ids: [],
          alt_text_loc_ids: [],
        },
      ];
      it("should decorate assets with timedAssets", () => {
        assetPool.assets = undefined;

        assetPool.updateAssets(
          MOCK_ASSET_DATA.reverse(),
          MOCK_TIMED_ASSET_DATA
        );

        expect(assetPool.assets).toEqual(DECORATED_ASSETS);
      });

      it("should preserve the playCount of previous assets", () => {
        expect.hasAssertions();
        assetPool.updateAssets(MOCK_ASSET_DATA, MOCK_TIMED_ASSET_DATA);
        const modifiedAssets = assetPool.assets.map((asset) => ({
          ...asset,
          playCount: Math.random(),
        }));
        assetPool.assets = modifiedAssets;
        assetPool.updateAssets(MOCK_ASSET_DATA, MOCK_TIMED_ASSET_DATA);
        assetPool.assets.forEach((asset) => {
          const existing = modifiedAssets.find((a) => a.id == asset.id);
          if (existing) expect(asset.playCount).toBe(existing.playCount);
        });
      });
    });
  });
});
