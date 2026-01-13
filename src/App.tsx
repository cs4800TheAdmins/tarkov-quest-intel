import MapView from "./ui/MapView/MapView";
import SearchPanel from "./ui/panels/SearchPanel";
import FilterPanel from "./ui/panels/FilterPanel";
import MarkerDetailPanel from "./ui/panels/MarkerDetailPanel";

export default function App() {
    return (
        <div style={{ display: "grid", height: "100vh", gridTemplateColumns: "300px 1fr 320px", backgroundColor: "#f5f5f5" }}>
          <aside style={{ 
            borderRight: "1px solid #ddd", 
            padding: "16px", 
            overflow: "auto", 
            boxSizing: "border-box",
            backgroundColor: "#ffffff"
          }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>Search</h2> 
            <SearchPanel />
            <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #e0e0e0" }} />
            <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>Filters</h2>
            <FilterPanel />
          </aside>

          <main style={{ position: "relative", overflow: "hidden", backgroundColor: "#1a1a1a" }}>
            <MapView />
          </main>
          
          <aside style={{ 
            borderLeft: "1px solid #ddd", 
            padding: "16px", 
            overflow: "auto", 
            boxSizing: "border-box",
            backgroundColor: "#ffffff"
          }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>Marker Details</h2>
            <MarkerDetailPanel />
          </aside>
        </div>
    );
}