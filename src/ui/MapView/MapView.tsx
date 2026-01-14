import { useEffect, useState, useRef, useCallback } from "react";
import { MapAssetLoader } from "../../data/MapAssetLoader";
import type { GameMap, Marker } from "../../domain/types";

const loader = new MapAssetLoader();

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const DEFAULT_ZOOM = 0.5;

type MapViewProps = {
    markers: Marker[];
    selectedMarkerId: string | null;
    onMarkerClick: (marker: Marker) => void;
};

export default function MapView({ markers, selectedMarkerId, onMarkerClick }: MapViewProps) {
    const [gameMap, setGameMap] = useState<GameMap | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        loader.loadMap("customs")
            .then(setGameMap)
            .catch(err => setError(err.message));
    }, []);


    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only left mouse button
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }, [pan.x, pan.y]);

    const handleRecenter = useCallback(() => {
        setPan({ x: 0, y: 0 });
        setZoom(0.3); // Zoom to 30%
    }, []);

    // Calculate pan boundaries based on zoom and container/image sizes
    const getPanBoundaries = useCallback(() => {
        if (!imageRef.current || !containerRef.current || !gameMap) {
            return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
        }

        const imgWidth = gameMap.widthPx * zoom;
        const imgHeight = gameMap.heightPx * zoom;
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // If image is smaller than container, center it (no panning needed)
        if (imgWidth <= containerWidth && imgHeight <= containerHeight) {
            return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
        }

        // Calculate maximum pan distances
        const maxPanX = (imgWidth - containerWidth) / 2;
        const maxPanY = (imgHeight - containerHeight) / 2;

        return {
            minX: -maxPanX,
            maxX: maxPanX,
            minY: -maxPanY,
            maxY: maxPanY,
        };
    }, [zoom, gameMap]);

    // Constrain pan values to boundaries
    const constrainPan = useCallback((x: number, y: number) => {
        const boundaries = getPanBoundaries();
        return {
            x: Math.max(boundaries.minX, Math.min(boundaries.maxX, x)),
            y: Math.max(boundaries.minY, Math.min(boundaries.maxY, y)),
        };
    }, [getPanBoundaries]);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const next = constrainPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
            setPan(next);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleGlobalMouseMove);
                document.removeEventListener("mouseup", handleGlobalMouseUp);
            };
        }
    }, [isDragging, dragStart, constrainPan]);

    // Constrain pan when zoom changes
    useEffect(() => {
        setPan(prev => {
            const next = constrainPan(prev.x, prev.y);
            if(next.x === prev.x && next.y === prev.y) return prev;
            return next;
        });
    }, [zoom, constrainPan]);

    if (error) {
        return (
            <div style={{ color: "#fff", padding: "20px", textAlign: "center" }}>
                Error loading map: {error}
            </div>
        );
    }
    
    if (!gameMap) {
        return (
            <div style={{ color: "#fff", padding: "20px", textAlign: "center" }}>
                Loading map...
            </div>
        );
    }

    
    return (
        <div 
            ref={containerRef}
            style={{ 
                width: "100%", 
                height: "100%", 
                position: "relative", 
                background: "#111",
                overflow: "hidden",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
        >

            {/* Zoom Controls */}
            <div style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                pointerEvents: "auto",
            }}>
                <button
                    onClick={() => setZoom(prevZoom => Math.min(MAX_ZOOM, prevZoom + 0.1))}
                    style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)"}
                    title="Zoom in"
                >
                    +
                </button>
                <button
                    onClick={handleRecenter}
                    style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "18px",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)"}
                    title="Recenter map"
                >
                    O
                </button>
                <button
                    onClick={() => setZoom(prevZoom => Math.max(MIN_ZOOM, prevZoom - 0.1))}
                    style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)"}
                    title="Zoom out"
                >
                    −
                </button>
            </div>

            {/* Map image */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
            >
                <img
                    ref={imageRef}
                    src={gameMap.imageUrl}
                    alt={gameMap.name}
                    style={{
                        display: "block",
                        maxWidth: "none",
                        maxHeight: "none",
                        width: gameMap.widthPx,
                        height: gameMap.heightPx,
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                    draggable={false}
                />

                {/* Markers */}
                {markers.map(marker => {
                    const isSelected = marker.id === selectedMarkerId;
                    return (
                        <button
                            key={marker.id}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) =>  {
                                e.stopPropagation();
                                onMarkerClick(marker)
                            }}
                            title={marker.name}
                            style={{
                                position: "absolute",
                                left: marker.x,
                                top: marker.y,
                                transform: "translate(-50%, -100%)",
                                width: 0,
                                height: 0,
                                borderLeft: "20px solid transparent",
                                borderRight: "20px solid transparent",
                                borderTop: "40px solid " + (isSelected ? "#27e4f5" : (marker.isTemporary ? "#be95be" : "#33fc19")),
                                background: marker.isTemporary ? "red" : "#242424",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}