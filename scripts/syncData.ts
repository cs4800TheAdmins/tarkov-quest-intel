import fs from "node:fs";
import path from "node:path";

import { tarkovDevQuery } from "../src/api/TarkovApiClient.js";
import { CUSTOMS_MARKERS_QUERY } from "../src/api/tarkovQueries.js";
import type { QueryResponse } from "../src/api/apiTypes.js";
import { mapMarkers } from "../src/services/markerMapper.js";

async function main() {
    const apiData = await tarkovDevQuery<QueryResponse>(CUSTOMS_MARKERS_QUERY);
    const apiMap = apiData.maps?.[0];
    if (!apiMap) throw new Error("No map data received from API");

    const markers = mapMarkers(apiMap);

    const outPath = path.resolve(process.cwd(), "public/maps/markers.customs.json");
    fs.writeFileSync(outPath, JSON.stringify(markers, null, 2), "utf-8");
    console.log(`Wrote ${markers.length} markers to ${outPath}`);
}

main().catch(err => {
    console.error("Error during sync:", err);
    process.exit(1);
})