import type { MarkerType } from "../../domain/types";

const MARKER_TYPES: MarkerType[] = ["QuestItem", "Landmark", "Extraction", "BossSpawn", "KeyLocation", "Other"];

type FilterPanelProps = {
    selectedTypes: Set<MarkerType>;
    onToggleType: (type: MarkerType) => void;
    showApproximate: boolean;
    onShowApproximateChange: (show: boolean) => void;
}

export default function FilterPanel({
    selectedTypes,
    onToggleType,
    showApproximate,
    onShowApproximateChange,
}: FilterPanelProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 14, fontWeight: 600, color: "#444" }}>Marker Types</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {MARKER_TYPES.map(type => (
                        <label
                            key={type}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                cursor: "pointer",
                                fontSize: 14,
                                padding: "4px 0",
                                color: "#333",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.has(type)}
                                onChange={() => onToggleType(type)}
                                style={{ 
                                    cursor: "pointer",
                                    width: 16,
                                    height: 16,
                                }}
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 14, fontWeight: 600, color: "#444" }}>Options</h3>
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "4px 0",
                        color: "#333",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={showApproximate}
                        onChange={(e) => onShowApproximateChange(e.target.checked)}
                        style={{ 
                            cursor: "pointer",
                            width: 16,
                            height: 16,
                        }}
                    />
                    <span>Show approximate locations</span>
                </label>
            </div>
        </div>
    );
}