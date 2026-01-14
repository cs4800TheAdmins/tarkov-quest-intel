import { useEffect, useMemo, useRef, useState } from "react";
import { MapAssetLoader } from "../../data/MapAssetLoader";
import type { GameMap } from "../../domain/types";

const loader = new MapAssetLoader();

const MIN_ZOOM = 0.2; // 20%
const MAX_ZOOM = 3;   // 300%
const RECENTER_ZOOM = 0.3; // 30%

export default function MapView() {
    const [gameMap, setGameMap] = useState<GameMap | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
    const [isDraggingUi, setIsDraggingUi] = useState(false);

    useEffect(() => {
        loader.loadMap("customs")
            .then(setGameMap)
            .catch(err => setError(err.message || "Failed to load map"));
    }, []);

    const scaledSize = useMemo(() => {
        if (!gameMap) return { width: 0, height: 0 };
        return {
            width: Math.max(1, Math.round(gameMap.widthPx * zoom)),
            height: Math.max(1, Math.round(gameMap.heightPx * zoom)),
        };
    }, [gameMap, zoom]);

    const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

    const recenter = () => {
        const container = containerRef.current;
        if (!container || !gameMap) return;

        const nextZoom = RECENTER_ZOOM;
        setZoom(nextZoom);

        // Wait for next paint so scaled size updates, then center scroll.
        requestAnimationFrame(() => {
            const c = containerRef.current;
            if (!c) return;

            const w = Math.max(1, Math.round(gameMap.widthPx * nextZoom));
            const h = Math.max(1, Math.round(gameMap.heightPx * nextZoom));
            c.scrollLeft = Math.max(0, (w - c.clientWidth) / 2);
            c.scrollTop = Math.max(0, (h - c.clientHeight) / 2);
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const container = containerRef.current;
        if (!container) return;

        isDraggingRef.current = true;
        setIsDraggingUi(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop,
        };
        e.preventDefault();
    };

    const stopDragging = () => {
        isDraggingRef.current = false;
        setIsDraggingUi(false);
        dragStartRef.current = null;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        const container = containerRef.current;
        const start = dragStartRef.current;
        if (!container || !start) return;

        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;

        // Drag map like a hand: move content opposite of mouse movement.
        container.scrollLeft = start.scrollLeft - dx;
        container.scrollTop = start.scrollTop - dy;
    };

    const zoomBy = (delta: number) => {
        const container = containerRef.current;
        if (!container || !gameMap) {
            setZoom(z => clampZoom(z + delta));
            return;
        }

        // Preserve viewport center while zooming.
        const centerX = container.scrollLeft + container.clientWidth / 2;
        const centerY = container.scrollTop + container.clientHeight / 2;

        const prevZoom = zoom;
        const nextZoom = clampZoom(prevZoom + delta);
        if (nextZoom === prevZoom) return;

        const scale = nextZoom / prevZoom;
        setZoom(nextZoom);

        requestAnimationFrame(() => {
            const c = containerRef.current;
            if (!c) return;
            c.scrollLeft = Math.max(0, centerX * scale - c.clientWidth / 2);
            c.scrollTop = Math.max(0, centerY * scale - c.clientHeight / 2);
        });
    };

    if (error) return <div>Error loading map: {error}</div>;
    if (!gameMap) return <div>Loading map...</div>;

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
                background: "#000",
                cursor: isDraggingUi ? "grabbing" : "grab",
                userSelect: "none",
                position: "relative",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
        >
            {/* Scroll surface (defines scroll boundaries) */}
            <div style={{ width: scaledSize.width, height: scaledSize.height, position: "relative" }}>
                <img
                    src={gameMap.imageUrl}
                    alt={gameMap.name}
                    draggable={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* Controls: +, O, - bottom-right */}
            <div
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    pointerEvents: "auto",
                }}
            >
                <button
                    onClick={() => zoomBy(0.1)}
                    style={{
                        width: 40,
                        height: 40,
                        fontSize: 20,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    title="Zoom in"
                >
                    +
                </button>
                <button
                    onClick={recenter}
                    style={{
                        width: 40,
                        height: 40,
                        fontSize: 18,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    title="Recenter (30%)"
                >
                    O
                </button>
                <button
                    onClick={() => zoomBy(-0.1)}
                    style={{
                        width: 40,
                        height: 40,
                        fontSize: 20,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    title="Zoom out"
                >
                    −
                </button>
            </div>
        </div>
    );
}
