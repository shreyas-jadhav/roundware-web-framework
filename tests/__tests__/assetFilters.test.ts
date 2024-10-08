import { faker } from "@faker-js/faker";
import { lineString, point } from "@turf/helpers";
import lineToPolygon from "@turf/line-to-polygon";
import { addDays, subDays } from "date-fns";
import { omit } from "lodash";
import { rankForGeofilteringEligibility } from "../../src/assetFilters";
import { assetDecorationMapper } from "../../src/assetPool";
import {
  allAssetFilter,
  anyAssetFilter,
  anyTagsFilter,
  assetShapeFilter,
  ASSET_PRIORITIES,
  calculateDistanceInMeters,
  dateRangeFilter,
  distanceFixedFilter,
  distanceRangesFilter,
  GeoListenMode,
  pausedAssetFilter,
  timedAssetFilter,
  timedRepeatFilter,
} from "../../src/roundware";
import { IDecoratedAsset } from "../../src/types/asset";
import {
  getRandomAssetData,
  getRandomDecoratedAssetData,
} from "../__mocks__/assetData";

describe("rankForGeofilteringEligibility", () => {
  test("should return false if geo listen mode is disabled", () => {
    expect(
      rankForGeofilteringEligibility(
        getRandomAssetData(1).map(assetDecorationMapper([]))[0],
        {
          geoListenMode: GeoListenMode.DISABLED,
        }
      )
    ).toBe(false);
  });

  test("should false if asset is undefined", () => {
    expect(
      rankForGeofilteringEligibility(undefined, {
        geoListenMode: GeoListenMode.AUTOMATIC,
        listenerPoint: point([
          +faker.address.latitude(),
          +faker.address.longitude(),
        ]),
      })
    ).toBe(false);
  });

  test("should should return true if asset and geo listen mode not disabled and wiith listener point", () => {
    expect(
      rankForGeofilteringEligibility(
        getRandomAssetData(1).map(assetDecorationMapper([]))[0],
        {
          geoListenMode: GeoListenMode.AUTOMATIC,
          listenerPoint: point([
            +faker.address.latitude(),
            +faker.address.longitude(),
          ]),
        }
      )
    ).toBe(true);
  });

  test("should return false listenerPoint is not passed", () => {
    expect(
      rankForGeofilteringEligibility(
        getRandomAssetData(1).map(assetDecorationMapper([]))[0],
        {
          geoListenMode: GeoListenMode.AUTOMATIC,
        }
      )
    ).toBe(false);
  });

  test("should return false if asset location is not passed", () => {
    const testAsset = getRandomAssetData(1).map(assetDecorationMapper([]))[0];
    // @ts-expect-error
    delete testAsset.locationPoint;
    expect(
      rankForGeofilteringEligibility(testAsset, {
        geoListenMode: GeoListenMode.AUTOMATIC,
        listenerPoint: point([
          +faker.address.latitude(),
          +faker.address.longitude(),
        ]),
      })
    ).toBe(false);
  });
});

describe("calculateDistanceInMeters()", () => {
  test("should return correct approximate correct in meters", () => {
    expect(
      +calculateDistanceInMeters(point([0, 1]), point([0, 2])).toFixed(0)
    ).toEqual(111195);
  });
});

describe("anyAssetsFilter", () => {
  const testDecoratedAsset = getRandomDecoratedAssetData(1)[0];
  test("should return lowest if no filters passed", () => {
    expect(anyAssetFilter([])(testDecoratedAsset, {})).toBe(
      ASSET_PRIORITIES.LOWEST
    );
  });

  test("should discard if all are discarded", () => {
    expect(
      anyAssetFilter([
        () => ASSET_PRIORITIES.DISCARD,
        () => ASSET_PRIORITIES.DISCARD,
        () => ASSET_PRIORITIES.DISCARD,
      ])(testDecoratedAsset, {})
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should return first non neutral and non discarded", () => {
    expect(
      anyAssetFilter([
        () => ASSET_PRIORITIES.DISCARD,
        () => ASSET_PRIORITIES.NEUTRAL,
        () => ASSET_PRIORITIES.HIGHEST,
      ])(testDecoratedAsset, {})
    ).toBe(ASSET_PRIORITIES.HIGHEST);
  });
});

describe("allAssetsFilter", () => {
  const testDecoratedAsset = getRandomDecoratedAssetData(1)[0];
  test("should return lowest if not filters", () => {
    expect(allAssetFilter([])(testDecoratedAsset, {})).toBe(
      ASSET_PRIORITIES.LOWEST
    );
  });

  test("should discard if any one of the filter discards", () => {
    expect(
      allAssetFilter([
        () => ASSET_PRIORITIES.LOWEST,
        () => ASSET_PRIORITIES.DISCARD,
        () => ASSET_PRIORITIES.NEUTRAL,
      ])(testDecoratedAsset, {})
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should not discard if none discards", () => {
    expect(
      allAssetFilter([
        () => ASSET_PRIORITIES.LOWEST,
        () => ASSET_PRIORITIES.NEUTRAL,
      ])(testDecoratedAsset, {})
    ).not.toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should return first non neutral rank", () => {
    expect(
      allAssetFilter([
        () => ASSET_PRIORITIES.NEUTRAL,
        () => ASSET_PRIORITIES.NEUTRAL,
        () => ASSET_PRIORITIES.HIGHEST,
      ])(testDecoratedAsset, {})
    ).toBe(ASSET_PRIORITIES.HIGHEST);
  });

  test("should return neutral if all are neutral", () => {
    expect(
      allAssetFilter([
        () => ASSET_PRIORITIES.NEUTRAL,
        () => ASSET_PRIORITIES.NEUTRAL,
      ])(testDecoratedAsset, {})
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });
});

describe("distanceFixedFilter()", () => {
  const testAsset = getRandomDecoratedAssetData(1)[0] as IDecoratedAsset;

  test("should be neutral if GeoListenMode is disabled", () => {
    expect(
      distanceFixedFilter()(testAsset, {
        geoListenMode: GeoListenMode.DISABLED,
      })
    ).toEqual(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should return neutral when not eligible for geo filtering", () => {
    expect(
      distanceFixedFilter()(testAsset, {
        geoListenMode: GeoListenMode.AUTOMATIC,
      })
    ).toEqual(ASSET_PRIORITIES.NEUTRAL);
  });

  test("testAsset has location point", () => {
    expect(testAsset.locationPoint).not.toBeFalsy();
  });

  test("should neutral if recording radius is not there", () => {
    expect(
      distanceFixedFilter()(testAsset, {
        geoListenMode: GeoListenMode.AUTOMATIC,
        listenerPoint: getRandomDecoratedAssetData(1)[0].locationPoint,
      })
    ).toEqual(ASSET_PRIORITIES.NEUTRAL);
  });

  const testListenerPoint = point([0, 0]);
  const testLocationPoint = point([7.743786, -0.593251]);

  test("should lowest if within recordingRadius", () => {
    expect(
      distanceFixedFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          locationPoint: testLocationPoint,
        },
        {
          listenerPoint: testListenerPoint,
          recordingRadius: 864.51 * 1000 + 1000,
        }
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should discard if not within recordingRadius", () => {
    expect(
      distanceFixedFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          locationPoint: testLocationPoint,
        },
        {
          listenerPoint: testListenerPoint,

          recordingRadius: 864.51 * 1000 - 1000,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });
});

describe("distanceRangesFilter()", () => {
  test("should netural if disabled", () => {
    expect(
      distanceRangesFilter()(getRandomDecoratedAssetData(1)[0], {
        getListenMode: GeoListenMode.DISABLED,
      })
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should neutral if no listenerPoint", () => {
    expect(
      distanceRangesFilter()(getRandomDecoratedAssetData(1)[0], {
        getListenMode: GeoListenMode.AUTOMATIC,
      })
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should neutral if no locationPoint", () => {
    expect(
      distanceRangesFilter()(
        // @ts-expect-error
        omit(getRandomDecoratedAssetData(1)[0], ["locationPoint"]),
        {
          getListenMode: GeoListenMode.AUTOMATIC,
          listenerPoint: getRandomDecoratedAssetData(1)[0].locationPoint,
        }
      )
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should neutral if no minDist maxDist", () => {
    expect(
      distanceRangesFilter()(getRandomDecoratedAssetData(1)[0], {
        getListenMode: GeoListenMode.AUTOMATIC,
        listenerPoint: getRandomDecoratedAssetData(1)[0].locationPoint,
      })
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  const testListenerPoint = point([0, 0]);
  const testLocationPoint = point([7.743786, -0.593251]);
  test("should lowest if within minDist maxDist", () => {
    expect(
      distanceRangesFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          locationPoint: testLocationPoint,
        },
        {
          getListenMode: GeoListenMode.AUTOMATIC,
          listenerPoint: testListenerPoint,
          minDist: 0,
          maxDist: 864.51 * 1000 + 1000,
        }
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should discard if not within minDist maxDist", () => {
    expect(
      distanceRangesFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          locationPoint: testLocationPoint,
        },
        {
          getListenMode: GeoListenMode.AUTOMATIC,
          listenerPoint: testListenerPoint,
          minDist: 0,
          maxDist: 864.51 * 1000 - 1000,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });
});

describe("anyTagsFilter()", () => {
  test("should return neutral if no tags", () => {
    expect(anyTagsFilter()(getRandomDecoratedAssetData(1)[0], {})).toBe(
      ASSET_PRIORITIES.NEUTRAL
    );
  });

  test("should return neutral if empty listen tag ids", () => {
    expect(
      anyTagsFilter()(getRandomDecoratedAssetData(1)[0], { listenTagIds: [] })
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should return lowest if asset includes tag id", () => {
    expect(
      anyTagsFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          tag_ids: [1],
        },
        {
          listenTagIds: [1],
        }
      )
    ).toBe(ASSET_PRIORITIES.LOWEST);
  });

  test("should discard if doesnt incclude tag id from listen tag ids", () => {
    expect(
      anyTagsFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          tag_ids: [2],
        },
        {
          listenTagIds: [1],
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });
});

describe("timedAssetFilter", () => {
  test("should neutral if no timed asset criteria", () => {
    expect(
      timedAssetFilter()(
        omit(getRandomDecoratedAssetData(1)[0], [
          "timedAssetStart",
          "timedAssetEnd",
        ]),
        {}
      )
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });
  test("should discard if played more than once", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: 1,
          timedAssetStart: 10,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 15,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should discard if start is exceeded", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: 0,
          timedAssetStart: 16,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 15,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should discard if end is exceeded", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: 0,
          timedAssetStart: 15,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 21,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should accept if within range", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: 0,
          timedAssetStart: 15,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 15,
          timedAssetPriority: "normal",
        }
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should get prority based on passed mix param", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: 0,
          timedAssetStart: 15,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 15,
          timedAssetPriority: "lowest",
        }
      )
    ).toBe(ASSET_PRIORITIES.LOWEST);
  });

  test("should get neutral if not a valid priority", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: 0,
          timedAssetStart: 15,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 15,
          timedAssetPriority: "sdfasdf",
        }
      )
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should not discard play count undefined", () => {
    expect(
      timedAssetFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0]),
          playCount: undefined!,
          timedAssetStart: 15,
          timedAssetEnd: 20,
        },
        {
          elapsedSeconds: 15,
          timedAssetPriority: "sdfasdf",
        }
      )
    ).not.toBe(ASSET_PRIORITIES.DISCARD);
  });
});

describe("assetShapeFilter", () => {
  test("should neutral if no shape", () => {
    expect(
      assetShapeFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0], ["shape"]),
        },
        {}
      )
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  const testShape = lineToPolygon(
    lineString(
      [
        [-74.07582533398437, 40.75286252052272],
        [-74.20628798046874, 40.69935160542775],
        [-74.0387464765625, 40.63950204556616],
        [-73.9570356611328, 40.755116481932895],
        [-74.07582533398437, 40.75286252052272],
      ],
      { name: "line 1" }
    )
  ).geometry;

  const testInsideLocation = point([-74.0387464765625, 40.71249480933102]);
  const testOutsideLocation = point([-74.22482740917968, 40.63598491125724]);
  test("should neutral if current location", () => {
    expect(
      assetShapeFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0], ["shape"]),
          shape: testShape,
        },
        {
          geoListenMode: GeoListenMode.DISABLED,
        }
      )
    ).toBe(ASSET_PRIORITIES.NEUTRAL);
  });

  test("should normal if listenerLocation within polygon", () => {
    expect(
      assetShapeFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0], ["shape"]),
          shape: testShape,
        },
        {
          geoListenMode: GeoListenMode.AUTOMATIC,
          listenerPoint: testInsideLocation,
        }
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should discard if listenerLocation outisde polygon", () => {
    expect(
      assetShapeFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0], ["shape"]),
          shape: testShape,
        },
        {
          geoListenMode: GeoListenMode.AUTOMATIC,
          listenerPoint: testOutsideLocation,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });
});

describe("timedRepeatFilter", () => {
  test("should normal if not listened before", () => {
    expect(
      timedRepeatFilter()(
        {
          ...omit(getRandomDecoratedAssetData(1)[0], ["lastListenTime"]),
        },
        {}
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should normal if asset is paused", () => {
    expect(
      timedRepeatFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          lastListenTime: Date.now(),
          status: "paused",
        },
        {}
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should discard if played and not asked to repeat", () => {
    expect(
      timedRepeatFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          playCount: 2,
        },
        {
          repeatRecordings: false,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should discard if last listen is less than banned duration", () => {
    expect(
      timedRepeatFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          lastListenTime: Date.now() - 200,
        },
        {
          repeatRecordings: true,
          bannedDuration: 600 / 1000,
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should lowest if last listen is more than banned duration", () => {
    expect(
      timedRepeatFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          lastListenTime: Date.now() - 600,
        },
        {
          repeatRecordings: true,
          bannedDuration: 600 / 1000,
        }
      )
    ).toBe(ASSET_PRIORITIES.LOWEST);
  });

  test("should not discard if playCount not passed", () => {
    expect(
      timedRepeatFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          lastListenTime: Date.now() - 600,
          playCount: undefined!,
        },
        {
          repeatRecordings: true,
          bannedDuration: 600 / 1000,
        }
      )
    ).not.toBe(ASSET_PRIORITIES.DISCARD);
  });
});

describe("dateRangeFilter", () => {
  test("should normal if within range", () => {
    const testDate = new Date();
    expect(
      dateRangeFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          created: testDate,
        },
        {
          startDate: subDays(testDate, 1),
          endDate: addDays(testDate, 1),
        }
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should discard if in filter future range", () => {
    expect(
      dateRangeFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          created: new Date(),
        },
        {
          startDate: addDays(new Date(), 1),
          endDate: addDays(new Date(), 2),
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should discard if in filter past range", () => {
    expect(
      dateRangeFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          created: new Date(),
        },
        {
          startDate: subDays(new Date(), 2),
          endDate: subDays(new Date(), 1),
        }
      )
    ).toBe(ASSET_PRIORITIES.DISCARD);
  });

  test("should be lowest if not date filters", () => {
    expect(
      dateRangeFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          created: new Date(),
        },
        {}
      )
    ).toBe(ASSET_PRIORITIES.LOWEST);
  });

  test("should convert created ISO string to date obejct", () => {
    const testDate = new Date();
    expect(
      dateRangeFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          created: testDate.toISOString(),
        },
        {
          startDate: subDays(testDate, 1),
          endDate: addDays(testDate, 1),
        }
      )
    ).toBe(ASSET_PRIORITIES.NORMAL);
  });

  test("should return lowest if no created", () => {
    const testDate = new Date();
    expect(
      dateRangeFilter()(
        {
          ...getRandomDecoratedAssetData(1)[0],
          created: undefined!,
        },
        {
          startDate: subDays(testDate, 1),
          endDate: addDays(testDate, 1),
        }
      )
    ).toBe(ASSET_PRIORITIES.LOWEST);
  });
});
describe("pausedAssetFilter", () => {
  test("should be lowest if asset is paused", () => {
    expect(
      pausedAssetFilter()({
        ...getRandomDecoratedAssetData(1)[0],
        status: "paused",
      })
    ).toEqual(ASSET_PRIORITIES.LOWEST);
  });

  test("should return normal if not paused", () => {
    expect(
      pausedAssetFilter()({
        ...getRandomDecoratedAssetData(1)[0],
        status: "resumed",
      })
    ).toEqual(ASSET_PRIORITIES.NORMAL);
  });
});
