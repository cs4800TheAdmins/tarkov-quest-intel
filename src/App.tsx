import { useState } from "react";
import MapView from "./ui/MapView/MapView";
import SearchPanel from "./ui/panels/SearchPanel";
import FilterPanel from "./ui/panels/FilterPanel";
import MarkerDetailPanel from "./ui/panels/MarkerDetailPanel";

const PANEL_WIDTH = "33.33vw";

export default function App() {
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

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
                <MapView />
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
                backgroundColor: "rgba(255, 255, 255, 0.95)",
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
                <SearchPanel />
                <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #e0e0e0" }} />
                <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>Filters</h2>
                <FilterPanel />
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
                        background: "rgba(255, 255, 255, 0.95)",
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
                backgroundColor: "rgba(255, 255, 255, 0.95)",
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
                <MarkerDetailPanel />
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
                        background: "rgba(255, 255, 255, 0.95)",
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