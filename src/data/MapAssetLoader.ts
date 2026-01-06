import type { GameMap } from "../domain/types";

export class MapAssetLoader { 
    async loadMap(mapName: string): Promise<GameMap> {
        const key = mapName.toLowerCase();
        const res = await fetch(`/maps/${key}.json`, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Failed to load map: ${res.status} ${res.statusText}`);
        return (await res.json()) as GameMap;
    }
}