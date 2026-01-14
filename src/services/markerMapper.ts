import type { Marker, Tag } from "../domain/types";
import type { Spawn, Extract, Transit, Hazard, Lock, MapData } from "../api/apiTypes";

type WorldPos = { x: number, z: number };
type MapPos = { x: number, y: number };

function worldToMap(pos: WorldPos): MapPos {
    // Convert from API world coords to web map pixel coords
    const x = 3.3498895526 * pos.x + -0.1066742134 * pos.z + 2067.7272310111;
    const y = 0.0019416183 * pos.x + -3.4147542227 * pos.z + 929.1105981920;

    return { x, y };
}

function makeTag(id: string, label: string): Tag {
    return { id, label };
}

function uniqueId(prefix: string, index: number): string {
    return `${prefix}-${index}`;
}

function clean(s: string | null | undefined): string {
    return (s ?? "").trim();
}

export function mapMarkers(map: MapData): Marker[] {
    const markers: Marker[] = [];

    const extracts = map.extracts ?? [];
    extracts.forEach((extract: Extract, i) => {
        const { x, y } = worldToMap(extract.position);
        markers.push({
            id: extract.id || uniqueId("extract", i),
            name: extract.name || `Extract #${i + 1}`,
            description: "Customs Extract Point",
            x: Math.round(x),
            y: Math.round(y),
            isApproximate: false,
            isVisible: true,
            tags: [makeTag("extraction", "Extraction")],
            isTemporary: false,
            type: "Extraction",
        });
    });

    const spawns = map.spawns ?? [];
    spawns.forEach((spawn: Spawn, i) => {
        const { x, y } = worldToMap(spawn.position);

        const isBoss = spawn.categories.some(cat => cat.toLowerCase() === "boss");
        // Only push spawn marker after determining if it's a boss spawn
        if (!isBoss) return;
        markers.push({
            id: uniqueId("bossspawn", i),
            name: `Boss Spawn: ${spawn.zoneName}`,
            description: `Boss Spawn Area. Contains categories: ${spawn.categories.join(", ")}.`,
            x: Math.round(x),
            y: Math.round(y),
            isApproximate: false,
            isVisible: true,
            tags: [makeTag("bossspawn", "Boss Spawn")],
            isTemporary: false,
            type: isBoss ? "BossSpawn" : "Landmark",
        });
    });

    (map.transits ?? []).forEach((transit: Transit, i) => {
        const { x, y } = worldToMap(transit.position);
        const target = clean(transit.map?.name);
        const desc = clean(transit.description);

        markers.push({
            id: transit.id || uniqueId("transit", i),
            name: target ? `To ${target}` : `Transit #${i + 1}`,
            description: desc || "Transit Point",
            x: Math.round(x),
            y: Math.round(y),
            isApproximate: false,
            isVisible: true,
            tags: [makeTag("transit", "Transit")],
            isTemporary: false,
            type: "Other",
        });
    });

    (map.locks ?? []).forEach((lock: Lock, i) => {
        const { x, y } = worldToMap(lock.position);
        const keyName = clean(lock.key?.name);
        const needsPower = lock.needsPower ? " (Needs Power)" : "";

        markers.push({
            id: lock.key?.id || uniqueId("lock", i),
            name: keyName || `Lock #${i + 1}`,
            description: `Lock${needsPower}${keyName ? ` - Key: ${keyName}` : ""}`,
            x: Math.round(x),
            y: Math.round(y),
            isApproximate: false,
            isVisible: true,
            tags: [makeTag("keylocation", "Key Location")],
            isTemporary: false,
            type: "KeyLocation",
        });
    });

    (map.hazards ?? []).forEach((hazard: Hazard, i) => {
        const { x, y } = worldToMap(hazard.position);
        const name = clean(hazard.name) || `${hazard.hazardType} Hazard`;
        
        markers.push({
            id: uniqueId("hazard", i),
            name,
            description: `Hazard - Type: ${hazard.hazardType}`,
            x: Math.round(x),
            y: Math.round(y),
            isApproximate: false,
            isVisible: true,
            tags: [makeTag("landmark", "Landmark")],
            isTemporary: false,
            type: "Landmark",
        });
    });

    markers.push({
        "id": "landmark-1",
        "type": "Landmark",
        "name": "Dorms 3 Story",
        "description": "Point of interest",
        "x": 2668.37,
        "y": 388.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-2",
        "type": "Landmark",
        "name": "Dorms 2 Story",
        "description": "Point of interest",
        "x": 2845.37,
        "y": 425.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-3",
        "type": "Landmark",
        "name": "New Gas Station",
        "description": "Point of interest",
        "x": 3448.37,
        "y": 817.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-4",
        "type": "Landmark",
        "name": "Old Construction",
        "description": "Point of interest",
        "x": 2347.37,
        "y": 1039.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-5",
        "type": "Landmark",
        "name": "Storage",
        "description": "Point of interest",
        "x": 1100.37,
        "y": 1364.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-6",
        "type": "Landmark",
        "name": "Customs Building (Big Red)",
        "description": "Point of interest",
        "x": 1398.37,
        "y": 1310.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-7",
        "type": "Landmark",
        "name": "Warehouse Courtyard",
        "description": "Point of interest",
        "x": 3416.37,
        "y": 1111.22,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-8",
        "type": "Landmark",
        "name": "Old Gas Station",
        "description": "Point of interest",
        "x": 3147.96,
        "y": 1530.28,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    {
        "id": "landmark-9",
        "type": "Landmark",
        "name": "Warehouse Silos",
        "description": "Point of interest",
        "x": 4067.96,
        "y": 1245.28,
        "isApproximate": false,
        "isVisible": true,
        "tags": [],
        "isTemporary": false
    },
    )

    return markers;
}
