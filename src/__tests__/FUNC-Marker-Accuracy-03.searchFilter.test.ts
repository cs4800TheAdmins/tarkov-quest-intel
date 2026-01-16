import { describe, it, expect } from "vitest";
import type { Marker, MarkerType, Tag } from "../domain/types";

function filterMarkers(
  markers: Marker[],
  options: {
    searchQuery?: string;
    selectedTypes?: Set<MarkerType>;
    showApproximate?: boolean;
  }
): Marker[] {
  const {
    searchQuery = "",
    selectedTypes = new Set<MarkerType>(["QuestItem", "Landmark", "Extraction", "BossSpawn", "KeyLocation", "Other"]),
    showApproximate = true,
  } = options;

  const q = searchQuery.trim().toLowerCase();

  return markers.filter((marker) => {
    if (!selectedTypes.has(marker.type)) return false;
    if (!showApproximate && marker.isApproximate) return false;
    if (!marker.isVisible) return false;

    if (!q) return true;

    const inName = marker.name.toLowerCase().includes(q);
    const inDesc = (marker.description ?? "").toLowerCase().includes(q);
    const inTags = (marker.tags ?? []).some((tag) => tag.label.toLowerCase().includes(q));

    return inName || inDesc || inTags;
  });
}

function makeMarker(overrides: Partial<Marker>): Marker {
  return {
    id: "test-marker",
    name: "Test Marker",
    description: "A test marker",
    x: 100,
    y: 200,
    isApproximate: false,
    isVisible: true,
    tags: [],
    isTemporary: false,
    type: "Landmark",
    ...overrides,
  };
}

function makeTag(id: string, label: string): Tag {
  return { id, label };
}

describe("FUNC-Marker-Accuracy-03: Search and Filter Accuracy", () => {
  describe("text search", () => {
    const markers: Marker[] = [
      makeMarker({ id: "m1", name: "Dorms 3 Story", description: "Main building" }),
      makeMarker({ id: "m2", name: "Gas Station", description: "Fuel point" }),
      makeMarker({ id: "m3", name: "Checkpoint", description: "Border crossing" }),
      makeMarker({
        id: "m4",
        name: "Warehouse",
        description: "Storage area",
        tags: [makeTag("loot", "High Loot")],
      }),
    ];

    it("returns all markers when search query is empty", () => {
      const result = filterMarkers(markers, { searchQuery: "" });
      expect(result).toHaveLength(4);
    });

    it("returns all markers when search query is whitespace only", () => {
      const result = filterMarkers(markers, { searchQuery: "   " });
      expect(result).toHaveLength(4);
    });

    it("filters by name (case-insensitive)", () => {
      const result = filterMarkers(markers, { searchQuery: "dorms" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m1");
    });

    it("filters by name with mixed case query", () => {
      const result = filterMarkers(markers, { searchQuery: "DoRmS" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m1");
    });

    it("filters by partial name match", () => {
      const result = filterMarkers(markers, { searchQuery: "station" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m2");
    });

    it("filters by description", () => {
      const result = filterMarkers(markers, { searchQuery: "border" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m3");
    });

    it("filters by tag label", () => {
      const result = filterMarkers(markers, { searchQuery: "loot" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m4");
    });

    it("matches across name, description, and tags (OR logic)", () => {
      const testMarkers: Marker[] = [
        makeMarker({ id: "m1", name: "Alpha Location", description: "Nothing special" }),
        makeMarker({ id: "m2", name: "Beta Place", description: "Alpha squad area" }),
        makeMarker({
          id: "m3",
          name: "Gamma Zone",
          description: "No match",
          tags: [makeTag("t1", "Alpha Team")],
        }),
        makeMarker({ id: "m4", name: "Delta Spot", description: "Unrelated" }),
      ];

      const result = filterMarkers(testMarkers, { searchQuery: "alpha" });
      expect(result).toHaveLength(3);
      expect(result.map((m) => m.id).sort()).toEqual(["m1", "m2", "m3"]);
    });

    it("returns empty array when no matches found", () => {
      const result = filterMarkers(markers, { searchQuery: "nonexistent" });
      expect(result).toHaveLength(0);
    });
  });

  describe("type filtering", () => {
    const markers: Marker[] = [
      makeMarker({ id: "m1", type: "Extraction" }),
      makeMarker({ id: "m2", type: "Extraction" }),
      makeMarker({ id: "m3", type: "BossSpawn" }),
      makeMarker({ id: "m4", type: "Landmark" }),
      makeMarker({ id: "m5", type: "QuestItem" }),
      makeMarker({ id: "m6", type: "KeyLocation" }),
      makeMarker({ id: "m7", type: "Other" }),
    ];

    it("returns all markers when all types selected", () => {
      const allTypes = new Set<MarkerType>([
        "QuestItem",
        "Landmark",
        "Extraction",
        "BossSpawn",
        "KeyLocation",
        "Other",
      ]);
      const result = filterMarkers(markers, { selectedTypes: allTypes });
      expect(result).toHaveLength(7);
    });

    it("filters to single type", () => {
      const result = filterMarkers(markers, {
        selectedTypes: new Set<MarkerType>(["Extraction"]),
      });
      expect(result).toHaveLength(2);
      expect(result.every((m) => m.type === "Extraction")).toBe(true);
    });

    it("filters to multiple types", () => {
      const result = filterMarkers(markers, {
        selectedTypes: new Set<MarkerType>(["Extraction", "BossSpawn"]),
      });
      expect(result).toHaveLength(3);
      expect(result.map((m) => m.type).sort()).toEqual(["BossSpawn", "Extraction", "Extraction"]);
    });

    it("returns empty array when no types selected", () => {
      const result = filterMarkers(markers, {
        selectedTypes: new Set<MarkerType>(),
      });
      expect(result).toHaveLength(0);
    });

    it("excludes unselected types", () => {
      const result = filterMarkers(markers, {
        selectedTypes: new Set<MarkerType>(["Landmark", "QuestItem"]),
      });
      expect(result).toHaveLength(2);
      expect(result.some((m) => m.type === "Extraction")).toBe(false);
      expect(result.some((m) => m.type === "BossSpawn")).toBe(false);
    });
  });

  describe("approximate location filtering", () => {
    const markers: Marker[] = [
      makeMarker({ id: "m1", isApproximate: false }),
      makeMarker({ id: "m2", isApproximate: true }),
      makeMarker({ id: "m3", isApproximate: false }),
      makeMarker({ id: "m4", isApproximate: true }),
    ];

    it("includes approximate markers when showApproximate is true", () => {
      const result = filterMarkers(markers, { showApproximate: true });
      expect(result).toHaveLength(4);
    });

    it("excludes approximate markers when showApproximate is false", () => {
      const result = filterMarkers(markers, { showApproximate: false });
      expect(result).toHaveLength(2);
      expect(result.every((m) => !m.isApproximate)).toBe(true);
    });
  });

  describe("visibility filtering", () => {
    const markers: Marker[] = [
      makeMarker({ id: "m1", isVisible: true }),
      makeMarker({ id: "m2", isVisible: false }),
      makeMarker({ id: "m3", isVisible: true }),
      makeMarker({ id: "m4", isVisible: false }),
    ];

    it("excludes hidden markers regardless of other filters", () => {
      const result = filterMarkers(markers, {});
      expect(result).toHaveLength(2);
      expect(result.every((m) => m.isVisible)).toBe(true);
    });

    it("hidden markers are excluded even when matching search", () => {
      const testMarkers: Marker[] = [
        makeMarker({ id: "m1", name: "Target", isVisible: true }),
        makeMarker({ id: "m2", name: "Target Hidden", isVisible: false }),
      ];

      const result = filterMarkers(testMarkers, { searchQuery: "target" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m1");
    });
  });

  describe("combined filters", () => {
    const markers: Marker[] = [
      makeMarker({
        id: "m1",
        name: "ZB-1011",
        type: "Extraction",
        isApproximate: false,
        isVisible: true,
      }),
      makeMarker({
        id: "m2",
        name: "ZB-1012",
        type: "Extraction",
        isApproximate: true,
        isVisible: true,
      }),
      makeMarker({
        id: "m3",
        name: "Reshala",
        type: "BossSpawn",
        isApproximate: false,
        isVisible: true,
      }),
      makeMarker({
        id: "m4",
        name: "Hidden Extract",
        type: "Extraction",
        isApproximate: false,
        isVisible: false,
      }),
      makeMarker({
        id: "m5",
        name: "Dorms",
        type: "Landmark",
        isApproximate: false,
        isVisible: true,
      }),
    ];

    it("applies search and type filter together", () => {
      const result = filterMarkers(markers, {
        searchQuery: "zb",
        selectedTypes: new Set<MarkerType>(["Extraction"]),
      });
      expect(result).toHaveLength(2);
      expect(result.map((m) => m.id).sort()).toEqual(["m1", "m2"]);
    });

    it("applies search, type, and approximate filters together", () => {
      const result = filterMarkers(markers, {
        searchQuery: "zb",
        selectedTypes: new Set<MarkerType>(["Extraction"]),
        showApproximate: false,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("m1");
    });

    it("visibility filter takes precedence", () => {
      const result = filterMarkers(markers, {
        searchQuery: "zb",
        selectedTypes: new Set<MarkerType>(["Extraction"]),
      });
      // m1, m2 match "zb" and are visible
      // m4 doesn't match "zb" anyway, but demonstrates visibility filtering
      expect(result).toHaveLength(2);
      expect(result.map((m) => m.id).sort()).toEqual(["m1", "m2"]);

      // Verify hidden marker is excluded even when it matches search
      const hiddenTestMarkers: Marker[] = [
        makeMarker({ id: "visible", name: "Test Location", isVisible: true }),
        makeMarker({ id: "hidden", name: "Test Hidden", isVisible: false }),
      ];
      const hiddenResult = filterMarkers(hiddenTestMarkers, { searchQuery: "test" });
      expect(hiddenResult).toHaveLength(1);
      expect(hiddenResult[0].id).toBe("visible");
    });

    it("all filters work in combination", () => {
      const result = filterMarkers(markers, {
        searchQuery: "",
        selectedTypes: new Set<MarkerType>(["Extraction", "Landmark"]),
        showApproximate: false,
      });
      // m1: Extraction, not approximate, visible - included
      // m2: Extraction, approximate - excluded
      // m3: BossSpawn - excluded by type
      // m4: Extraction, not approximate, not visible - excluded
      // m5: Landmark, not approximate, visible - included
      expect(result).toHaveLength(2);
      expect(result.map((m) => m.id).sort()).toEqual(["m1", "m5"]);
    });
  });

  describe("edge cases", () => {
    it("handles empty marker array", () => {
      const result = filterMarkers([], { searchQuery: "test" });
      expect(result).toHaveLength(0);
    });

    it("handles marker with empty tags array", () => {
      const markers = [makeMarker({ id: "m1", tags: [] })];
      const result = filterMarkers(markers, { searchQuery: "sometag" });
      expect(result).toHaveLength(0);
    });

    it("handles marker with undefined description gracefully", () => {
      const markers = [
        makeMarker({
          id: "m1",
          name: "Specific Name",
          description: undefined as unknown as string,
        }),
      ];
      const result = filterMarkers(markers, { searchQuery: "nonexistent" });
      expect(result).toHaveLength(0);
    });

    it("handles special characters in search query", () => {
      const markers = [
        makeMarker({ id: "m1", name: "ZB-1011 (PMC)" }),
        makeMarker({ id: "m2", name: "Extract #2" }),
      ];

      expect(filterMarkers(markers, { searchQuery: "(pmc)" })).toHaveLength(1);
      expect(filterMarkers(markers, { searchQuery: "#2" })).toHaveLength(1);
      expect(filterMarkers(markers, { searchQuery: "zb-" })).toHaveLength(1);
    });

    it("trims whitespace from search query", () => {
      const markers = [makeMarker({ id: "m1", name: "Dorms" })];
      const result = filterMarkers(markers, { searchQuery: "  dorms  " });
      expect(result).toHaveLength(1);
    });
  });
});
