import { describe, it, expect } from "vitest";
import { mapMarkers } from "../services/markerMapper";
import type { MapData, Extract, Transit, Spawn } from "../api/apiTypes";

function makeMapData(overrides: Partial<MapData>): MapData {
  return {
    id: "test-map",
    name: "Test Map",
    normalizedName: "test-map",
    spawns: [],
    extracts: [],
    transits: [],
    locks: [],
    switches: [],
    hazards: [],
    lootContainers: [],
    lootLoose: [],
    stationaryWeapons: [],
    btrStops: [],
    ...overrides,
  };
}

describe("FUNC-Marker-Accuracy-02: Marker Name/Description Accuracy", () => {
  describe("extract markers", () => {
    it("uses extract name from API", () => {
      const extracts: Extract[] = [
        { id: "ex1", name: "Crossroads", position: { x: -334.8, y: 0, z: -88.0 } },
        { id: "ex2", name: "ZB-1011", position: { x: 621, y: 0, z: -129 } },
      ];

      const markers = mapMarkers(makeMapData({ extracts }));

      const crossroadsMarker = markers.find((m) => m.id === "ex1");
      expect(crossroadsMarker, "Missing marker for Crossroads").toBeTruthy();
      expect(crossroadsMarker!.name).toBe("Crossroads");

      const zbMarker = markers.find((m) => m.id === "ex2");
      expect(zbMarker, "Missing marker for ZB-1011").toBeTruthy();
      expect(zbMarker!.name).toBe("ZB-1011");
    });

    it("generates description including extract name", () => {
      const extracts: Extract[] = [
        { id: "ex1", name: "Smugglers' Boat", position: { x: 0, y: 0, z: 0 } },
      ];

      const markers = mapMarkers(makeMapData({ extracts }));
      const marker = markers.find((m) => m.id === "ex1");

      expect(marker!.description).toContain("Smugglers' Boat");
    });
  });

  describe("transit markers", () => {
    it("uses transit description from API", () => {
      const transits: Transit[] = [
        {
          id: "t1",
          description: "Transit to Interchange via underground passage",
          position: { x: 10, y: 0, z: 20 },
          map: { name: "Interchange" },
        },
      ];

      const markers = mapMarkers(makeMapData({ transits }));
      const transitMarker = markers.find((m) => m.id === "t1");

      expect(transitMarker, "Missing marker for transit").toBeTruthy();
      expect(transitMarker!.description).toBe("Transit to Interchange via underground passage");
    });

    it("derives name from target map when available", () => {
      const transits: Transit[] = [
        {
          id: "t1",
          description: "Some description",
          position: { x: 0, y: 0, z: 0 },
          map: { name: "Interchange" },
        },
      ];

      const markers = mapMarkers(makeMapData({ transits }));
      const transitMarker = markers.find((m) => m.id === "t1");

      expect(transitMarker!.name).toContain("Interchange");
    });

    it("falls back to numbered name when no target map", () => {
      const transits: Transit[] = [
        {
          id: "t1",
          description: "Orphan transit",
          position: { x: 0, y: 0, z: 0 },
          map: null,
        },
      ];

      const markers = mapMarkers(makeMapData({ transits }));
      const transitMarker = markers.find((m) => m.id === "t1");

      expect(transitMarker!.name.length).toBeGreaterThan(0);
    });
  });

  describe("boss spawn markers", () => {
    it("includes zoneName in boss spawn marker name", () => {
      const spawns: Spawn[] = [
        {
          zoneName: "Dorms",
          sides: [],
          categories: ["boss"],
          position: { x: 100, y: 0, z: 100 },
        },
      ];

      const markers = mapMarkers(makeMapData({ spawns }));
      const bossMarker = markers.find((m) => m.name.includes("Dorms"));

      expect(bossMarker, "Missing boss spawn marker for Dorms").toBeTruthy();
      expect(bossMarker!.description).toContain("boss");
    });

    it("does not create marker for non-boss spawns", () => {
      const spawns: Spawn[] = [
        {
          zoneName: "PlayerSpawn",
          sides: ["pmc"],
          categories: ["player"],
          position: { x: 0, y: 0, z: 0 },
        },
      ];

      const markers = mapMarkers(makeMapData({ spawns }));
      const spawnMarkers = markers.filter((m) => m.type === "BossSpawn");

      expect(spawnMarkers.length).toBe(0);
    });
  });
});
