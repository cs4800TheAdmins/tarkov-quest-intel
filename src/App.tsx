import { useState } from "react";
import MapView from "./ui/MapView/MapView";
import SearchPanel from "./ui/panels/SearchPanel";
import FilterPanel from "./ui/panels/FilterPanel";
import MarkerDetailPanel from "./ui/panels/MarkerDetailPanel";

export default function App() {
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);

    const leftWidth = 300;
    const rightWidth = 320;
    const collapsedRail = 34;

    return (
        <div
          style={{
            display: "grid",
            height: "100vh",
            gridTemplateColumns: `${leftCollapsed ? `${collapsedRail}px` : `${leftWidth}px`} 1fr ${rightCollapsed ? `${collapsedRail}px` : `${rightWidth}px`}`,
            transition: "grid-template-columns 0.2s ease",
          }}
        >
          <aside style={{ borderRight: "1px solid #ddd", padding: 12, overflow: "auto", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {!leftCollapsed && <h2 style={{ margin: 0 }}>Search</h2>}
              <button
                type="button"
                onClick={() => setLeftCollapsed(v => !v)}
                title={leftCollapsed ? "Expand Search" : "Collapse Search"}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginLeft: leftCollapsed ? 0 : "auto",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  fontFamily: "inherit",
                  color: "#333",
                }}
              >
                {leftCollapsed ? "▶" : "◀"}
              </button>
            </div>

            {!leftCollapsed ? (
              <>
                <SearchPanel />
                <hr />
                <h2>Filters</h2>
                <FilterPanel />
              </>
            ) : (
              <div style={{ writingMode: "vertical-rl", textOrientation: "mixed", color: "#666", fontSize: 12 }}>
                Search
              </div>
            )}
          </aside>

          <main style={{ position: "relative", overflow: "hidden", minWidth: 0, minHeight: 0 }}>
            <MapView />
          </main>
          
          <aside style={{ borderLeft: "1px solid #ddd", padding: 12, overflow: "auto", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => setRightCollapsed(v => !v)}
                title={rightCollapsed ? "Expand Marker Details" : "Collapse Marker Details"}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  flexShrink: 0,
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  fontFamily: "inherit",
                  color: "#333",
                }}
              >
                {rightCollapsed ? "◀" : "▶"}
              </button>
              {!rightCollapsed && <h2 style={{ margin: 0 }}>Marker Details</h2>}
            </div>

            {!rightCollapsed ? (
              <MarkerDetailPanel />
            ) : (
              <div style={{ writingMode: "vertical-rl", textOrientation: "mixed", color: "#666", fontSize: 12 }}>
                Details
              </div>
            )}
          </aside>
        </div>
    );
}