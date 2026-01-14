import { useState, useMemo, useEffect} from "react";
import MapView from "./ui/MapView/MapView";
import SearchPanel from "./ui/panels/SearchPanel";
import FilterPanel from "./ui/panels/FilterPanel";
import MarkerDetailPanel from "./ui/panels/MarkerDetailPanel";
import type { Marker, MarkerType } from "./domain/types";
import { MarkerController } from "./domain/MarkerController";

const PANEL_WIDTH = "22vw";
const ALL_TYPES: MarkerType[] = ["QuestItem", "Landmark", "Extraction", "BossSpawn", "KeyLocation", "Other"];

const markerController = new MarkerController();

export default function App() {
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

    const [markers, setMarkers] = useState<Marker[]>([]);
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<Set<MarkerType>>(new Set(ALL_TYPES));
    const [showApproximate, setShowApproximate] = useState(true);

    useEffect(() => {
        markerController
        .loadFromJson("/maps/markers.customs.json")
        .then(setMarkers)
        .catch((err) => console.error("Failed to load markers:", err));
    }, []);

    const visibleMarkers = useMemo(() => {
      const q = searchQuery.trim().toLowerCase();
      return markers.filter(marker => {
        if(!selectedTypes.has(marker.type)) return false;
        if (!showApproximate && marker.isApproximate) return false;
        if (!marker.isVisible) return false;

        if (!q) return true;

        const inName = marker.name.toLowerCase().includes(q);
        const inDesc = (marker.description ?? "").toLowerCase().includes(q);
        const inTags = (marker.tags ?? []).some(tag => tag.label.toLowerCase().includes(q));

        return inName || inDesc || inTags;
      })
    }, [markers, searchQuery, selectedTypes, showApproximate]);

    const toggleType = (type: MarkerType) => {
      setSelectedTypes(prev => {
        const next = new Set(prev);
        if (next.has(type)) next.delete(type);
        else next.add(type);
        return next;
      });
    }

    const selectedMarker = useMemo(() => {
      if (!selectedMarkerId) return null;
      return markers.find(m => m.id === selectedMarkerId) || null;
    }, [markers, selectedMarkerId]);
    const [zoomOnMarkerRequest, setZoomOnMarkerRequest] = useState(0);

    const nameMatches = useMemo(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return [];
      return markers
        .filter(m => m.name.toLowerCase().includes(q))
        .slice(0, 10);
    }, [markers, searchQuery]);

    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
            {/* Map as background */}
            <div style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                zIndex: 0 
            }}>
                <MapView
                  markers={visibleMarkers}
                  selectedMarkerId={selectedMarkerId}
                  onMarkerClick={(marker) => {
                    setSelectedMarkerId(marker.id);
                    setRightPanelCollapsed(false);
                  }}
                  zoomOnMarkerRequest={zoomOnMarkerRequest}
                  rightPanelCollapsed={rightPanelCollapsed}
                />
            </div>

            {/* Left Panel - Search */}
            <aside style={{
                position: "fixed",
                top: 0,
                left: leftPanelCollapsed ? `-${PANEL_WIDTH}` : "0",
                width: PANEL_WIDTH,
                height: "100vh",
                borderRight: "1px solid #ddd",
                padding: "16px",
                overflow: "auto",
                boxSizing: "border-box",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(10px)",
                zIndex: 10,
                transition: "left 0.3s ease",
                boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
            }}>
                <button
                    onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "transparent",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#666",
                        zIndex: 11,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title={leftPanelCollapsed ? "Expand panel" : "Collapse panel"}
                >
                    {leftPanelCollapsed ? "▶" : "◀"}
                </button>
                <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>Search</h2> 
                <SearchPanel
                  value={searchQuery}
                  onChange={setSearchQuery}
                  results={nameMatches}
                  onResultClick={(marker) => {
                    setSearchQuery(marker.name);
                    setSelectedMarkerId(marker.id);
                    setRightPanelCollapsed(false);
                    setZoomOnMarkerRequest(r => r + 1);
                  }}
                />
                <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #e0e0e0" }} />
                <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>Filters</h2>
                <FilterPanel
                  selectedTypes={selectedTypes}
                  onToggleType={toggleType}
                  showApproximate={showApproximate}
                  onShowApproximateChange={setShowApproximate}
                />
            </aside>

            {/* Collapse button when left panel is collapsed */}
            {leftPanelCollapsed && (
                <button
                    onClick={() => setLeftPanelCollapsed(false)}
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "0",
                        transform: "translateY(-50%)",
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid #ddd",
                        borderLeft: "none",
                        borderRadius: "0 4px 4px 0",
                        padding: "12px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#666",
                        zIndex: 10,
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                    }}
                    title="Expand Search panel"
                >
                    Search & Filters ▶
                </button>
            )}

            {/* Right Panel - Marker Details */}
            <aside style={{
                position: "fixed",
                top: 0,
                right: rightPanelCollapsed ? `-${PANEL_WIDTH}` : "0",
                width: PANEL_WIDTH,
                height: "100vh",
                borderLeft: "1px solid #ddd",
                padding: "16px",
                overflow: "auto",
                boxSizing: "border-box",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(10px)",
                zIndex: 10,
                transition: "right 0.3s ease",
                boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <button
                        onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                        style={{
                            background: "transparent",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            color: "#666",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title={rightPanelCollapsed ? "Expand panel" : "Collapse panel"}
                    >
                        {rightPanelCollapsed ? "◀" : "▶"}
                    </button>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#333" }}>Marker Details</h2>
                </div>
                <MarkerDetailPanel marker={selectedMarker}/>
            </aside>

            {/* Collapse button when right panel is collapsed */}
            {rightPanelCollapsed && (
                <button
                    onClick={() => setRightPanelCollapsed(false)}
                    style={{
                        position: "fixed",
                        top: "50%",
                        right: "0",
                        transform: "translateY(-50%)",
                        background: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid #ddd",
                        borderRight: "none",
                        borderRadius: "4px 0 0 4px",
                        padding: "12px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#666",
                        zIndex: 10,
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                    }}
                    title="Expand Marker Details panel"
                >
                    ◀ Marker Details
                </button>
            )}
        </div>
    );
}