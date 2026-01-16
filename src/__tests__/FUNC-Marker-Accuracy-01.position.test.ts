import { describe, it, expect } from "vitest";
import { mapMarkers, worldToMap } from "../services/markerMapper";
import type { MapData, Extract } from "../api/apiTypes";

describe("FUNC-Marker-Accuracy-01: Marker Position Accuracy", () => {
  describe("worldToMap coordinate conversion", () => {
    // Transformation coefficients from markerMapper.ts
    const COEFFS = {
      xFromX: 3.3498895526,
      xFromZ: -0.1066742134,
      xOffset: 2067.7272310111,
      yFromX: 0.0019416183,
      yFromZ: -3.4147542227,
      yOffset: 929.1105981920,
    };

    function expectedConversion(pos: { x: number; z: number }) {
      return {
        x: COEFFS.xFromX * pos.x + COEFFS.xFromZ * pos.z + COEFFS.xOffset,
        y: COEFFS.yFromX * pos.x + COEFFS.yFromZ * pos.z + COEFFS.yOffset,
      };
    }

    it("applies transformation correctly", () => {
      const testInputs = [
        { x: 0, z: 0 },
        { x: 100, z: 0 },
        { x: 0, z: 100 },
        { x: -42, z: 123 },
        { x: 621, z: -129 },
      ];

      for (const input of testInputs) {
        const result = worldToMap(input);
        const expected = expectedConversion(input);
        expect(result.x).toBeCloseTo(expected.x, 6);
        expect(result.y).toBeCloseTo(expected.y, 6);
      }
    });

    it("handles negative coordinates", () => {
      const input = { x: -500, z: -300 };
      const result = worldToMap(input);
      const expected = expectedConversion(input);
      expect(result.x).toBeCloseTo(expected.x, 6);
      expect(result.y).toBeCloseTo(expected.y, 6);
    });

    it("origin maps to the correct offset values", () => {
      const result = worldToMap({ x: 0, z: 0 });
      expect(result.x).toBeCloseTo(COEFFS.xOffset, 6);
      expect(result.y).toBeCloseTo(COEFFS.yOffset, 6);
    });

    it("x-axis scaling works correctly (z=0)", () => {
      const result = worldToMap({ x: 1, z: 0 });
      expect(result.x - COEFFS.xOffset).toBeCloseTo(COEFFS.xFromX, 6);
      expect(result.y - COEFFS.yOffset).toBeCloseTo(COEFFS.yFromX, 6);
    });

    it("z-axis scaling works correctly (x=0)", () => {
      const result = worldToMap({ x: 0, z: 1 });
      expect(result.x - COEFFS.xOffset).toBeCloseTo(COEFFS.xFromZ, 6);
      expect(result.y - COEFFS.yOffset).toBeCloseTo(COEFFS.yFromZ, 6);
    });
  });

  describe("mapMarkers applies conversion to API data", () => {
    it("converts extract positions from world to map coordinates", () => {
      const apiExtracts: Extract[] = [
        {
          id: "311ae28f72d9c9fe3be801b2d503088167e325c3",
          name: "Smugglers' Boat",
          position: { x: -42, y: 0, z: 123 },
        },
        {
          id: "02cdf102e32c481d3b5fabcf1dcf3df3962522bb",
          name: "ZB-1011",
          position: { x: 621, y: 0, z: -129 },
        },
      ];

      const apiMapData: MapData = {
        id: "customs",
        name: "Customs",
        normalizedName: "customs",
        extracts: apiExtracts,
        spawns: [],
        transits: [],
        locks: [],
        switches: [],
        hazards: [],
        lootContainers: [],
        lootLoose: [],
        stationaryWeapons: [],
        btrStops: [],
      };

      const markers = mapMarkers(apiMapData);

      // Verify each extract marker has converted coordinates (rounded)
      for (const ex of apiExtracts) {
        const m = markers.find((mm) => mm.id === ex.id);
        expect(m, `Missing marker for extract ${ex.name}`).toBeTruthy();

        const expectedPos = worldToMap(ex.position);
        expect(m!.x).toBe(Math.round(expectedPos.x));
        expect(m!.y).toBe(Math.round(expectedPos.y));
      }
    });

    it("marker coordinates differ from raw API coordinates after conversion", () => {
      const apiExtract: Extract = {
        id: "test-extract",
        name: "Test Extract",
        position: { x: 100, y: 0, z: 200 },
      };

      const apiMapData: MapData = {
        id: "test-map",
        name: "Test Map",
        normalizedName: "test-map",
        extracts: [apiExtract],
        spawns: [],
        transits: [],
        locks: [],
        switches: [],
        hazards: [],
        lootContainers: [],
        lootLoose: [],
        stationaryWeapons: [],
        btrStops: [],
      };

      const markers = mapMarkers(apiMapData);
      const marker = markers.find((m) => m.id === "test-extract");

      expect(marker).toBeTruthy();
      expect(marker!.x).not.toBe(apiExtract.position.x);
      expect(marker!.y).not.toBe(apiExtract.position.z);

      const expected = worldToMap(apiExtract.position);
      expect(marker!.x).toBe(Math.round(expected.x));
      expect(marker!.y).toBe(Math.round(expected.y));
    });
  });
});
