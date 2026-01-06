import { useEffect, useState } from "react";
import { MapAssetLoader } from "../../data/MapAssetLoader";
import type { GameMap } from "../../domain/types";

const loader = new MapAssetLoader();

export default function MapView() {
    const [gameMap, setGameMap] = useState<GameMap | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loader.loadMap("customs")
            .then(setGameMap)
            .catch(err => setError(err.message));
    }, []);

    if (error) {
        return <div>Error loading map: {error}</div>;
    }
    
    if (!gameMap) {
        return <div>Loading map...</div>;
    }
    
    return (
        <div style={{ width: "100%", height: "100%", position: "relative", background: "#111" }}>
            <div style={{ position: "absolute", top: 12, left: 12, color: "#fff", fontSize: 12 }}>
                Map placeholder
            </div>
            <img
                src={gameMap.imageUrl}
                alt={gameMap.name}
                style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    margin: "0 auto",
                    objectFit: "contain",
                    userSelect: "none",
                }}
                draggable={false}
            />
        </div>
    )
}