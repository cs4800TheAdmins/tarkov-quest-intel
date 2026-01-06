import MapView from "./ui/MapView/MapView";
import SearchPanel from "./ui/panels/SearchPanel";
import FilterPanel from "./ui/panels/FilterPanel";
import MarkerDetailPanel from "./ui/panels/MarkerDetailPanel";

export default function App() {
    return (
        <div style={{ display: "grid", height: "100vh", gridTemplateColumns: "300px 1fr 320px" }}>
          <aside style={{ borderRight: "1px solid #ddd", padding: 12, overflow: "auto", boxSizing: "border-box" }}>
            <h2>Search</h2> 
            <SearchPanel />
            <hr />
            <h2>Filters</h2>
            <FilterPanel />
          </aside>

          <main style={{ position: "relative", overflow: "hidden" }}>
            <MapView />
          </main>
          
          <aside style={{ borderLeft: "1px solid #ddd", padding: 12, overflow: "auto", boxSizing: "border-box" }}>
            <h2>Marker Details</h2>
            <MarkerDetailPanel />
          </aside>
        </div>
    );
}