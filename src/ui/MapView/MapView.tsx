import {useEffect, useRef, useState} from "react";
import {MapAssetLoader} from "../../data/MapAssetLoader";
import type {GameMap, Marker} from "../../domain/types";
import {MapController} from "../../domain/MapController";
import {MarkerController} from "../../domain/MarkerController";

const loader = new MapAssetLoader();
const markerController = new MarkerController();

export function MapView()
{
    const [gameMap, setGameMap] = useState<GameMap | null>(null);
    const [controller, setController] = useState<MapController | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [placingMarker, setPlacingMarker] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mapContainer = useRef<HTMLDivElement>(null);
    const refObject = useRef<number | undefined>(undefined);
    const [, update] = useState(0);

    const render = () =>
    {
        if (!refObject.current) refObject.current = requestAnimationFrame(() =>
        {
            update(v => v + 1);
            refObject.current = undefined;
        });
    };

    const localPoint = (x: number, y: number) =>
    {
        const rect = mapContainer.current!.getBoundingClientRect();
        return {x: x - rect.left, y: y - rect.top};
    };

    const mapPoint = (x: number, y: number) =>
    {
        const p = localPoint(x, y);
        return {
            x: (p.x - controller!.position.x) / controller!.zoom,
            y: (p.y - controller!.position.y) / controller!.zoom,
        };
    };

    useEffect(() =>
    {
        loader.loadMap("customs")
            .then(map =>
            {
                setGameMap(map);
                setController(new MapController(map, mapContainer.current?.clientWidth ?? 800, mapContainer.current?.clientHeight ?? 600));
                return markerController.loadFromJson("/maps/markers.customs.json");
            })
            .then(setMarkers)
            .catch(err => setError(err.message || "Failed to load map"));
    }, []);

    useEffect(() =>
    {
        if (!controller) return;
        const resize = () =>
        {
            controller.updateContainerSize(mapContainer.current!.clientWidth, mapContainer.current!.clientHeight);
            render();
        };
        window.addEventListener("resize", resize);
        resize();
        return () => window.removeEventListener("resize", resize);
    }, [controller]);

    if (error) return <div>Error loading map: {error}</div>;
    if (!gameMap || !controller) return <div>Loading map...</div>;

    const handleMouseDown = (e: React.MouseEvent) =>
    {
        if (placingMarker)
        {
            const pos = mapPoint(e.clientX, e.clientY);
            const newMarker = markerController.placeMarker(pos.x, pos.y, {name: "New Marker", description: "Temporary marker", isTemporary: true});
            setMarkers([...markerController.getMarkers()]);
            setSelectedMarker(newMarker);
            setPlacingMarker(false);
        } else
        {
            e.preventDefault();
            const p = localPoint(e.clientX, e.clientY);
            controller.onMouseDown(p.x, p.y);
            render();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) =>
    {
        const {x, y} = localPoint(e.clientX, e.clientY);
        controller.onMouseMove(x, y);
        render();
    };

    const handleMouseUp = () =>
    {
        controller.onMouseUp();
        render();
    };

    const handleWheel = (e: React.WheelEvent) =>
    {
        e.preventDefault();
        const {x, y} = localPoint(e.clientX, e.clientY);
        controller.onWheel(x, y, e.deltaY);
        render();
    };

    return (
        <div style={{display: "flex", height: "100%"}}>
            <div
                ref={mapContainer}
                style={{
                    position: "relative",
                    flex: 1,
                    overflow: "hidden",
                    background: "#000000",
                    cursor: controller.dragging ? "grabbing" : "grab",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <img
                    src={gameMap.imageUrl}
                    alt={gameMap.name}
                    draggable={false}
                    style={{
                        display: "block",
                        transform: `translate(${controller.position.x}px, ${controller.position.y}px) scale(${controller.zoom})`,
                        transformOrigin: "top left",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />

                {markers.map(marker =>
                {
                    const x = controller.position.x + marker.x * controller.zoom;
                    const y = controller.position.y + marker.y * controller.zoom;
                    return (
                        <div
                            key={marker.id}
                            onClick={e =>
                            {
                                e.stopPropagation();
                                markerController.selectMarker(marker.id);
                                setSelectedMarker(marker);
                            }}
                            style={{
                                position: "absolute",
                                left: x - 6,
                                top: y - 6,
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: marker.isTemporary ? "red" : "#242424",
                                cursor: "pointer",
                            }}
                        />
                    );
                })}

                <button style={{position: "absolute", top: 12, right: 12, background: "#242424"}} onClick={() =>
                {
                    controller.recenter();
                    render();
                }}>Recenter
                </button>

                <button
                    style={{
                        position: "absolute",
                        top: 48,
                        right: 12,
                        background: placingMarker ? "#d93900" : "#242424",
                        color: "#ffffff",
                    }}
                    onClick={() => setPlacingMarker(p => !p)}
                >
                    {placingMarker ? "Click map" : "Place Marker"}
                </button>
            </div>

            {selectedMarker && (
                <div style={{width: 280, padding: 12, background: "#242424", color: "#ffffff"}}>
                    <h3>{selectedMarker.name}</h3>
                    <p>{selectedMarker.description}</p>
                    {selectedMarker.isApproximate && <p style={{color: "orange"}}>{selectedMarker.approximationNote}</p>}
                    {selectedMarker.isTemporary && (
                        <button
                            style={{marginTop: 8, background: "#d93900", color: "#ffffff"}}
                            onClick={() =>
                            {
                                markerController.deleteMarker(selectedMarker.id);
                                setMarkers([...markerController.getMarkers()]);
                                setSelectedMarker(null);
                            }}
                        >
                            Delete Marker
                        </button>
                    )}
                    <button style={{marginTop: 8}} onClick={() => setSelectedMarker(null)}>Close</button>
                </div>
            )}
        </div>
    );
}
