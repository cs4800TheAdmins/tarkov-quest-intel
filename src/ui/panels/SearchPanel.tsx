import type { Marker } from "../../domain/types";

type SearchPanelProps = {
    value: string;
    onChange: (value: string) => void;
    results: Marker[];
    onResultClick: (marker: Marker) => void;
}

export default function SearchPanel({ value, onChange, results, onResultClick }: SearchPanelProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Search by name, description, or tags..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 36px 10px 12px",
                        fontSize: 14,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#646cff"}
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}
                />
                {value && (
                    <button
                        onClick={() => onChange("")}
                        style={{
                            position: "absolute",
                            right: 6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px 8px",
                            fontSize: 20,
                            color: "#999",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#666"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#999"}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            {value && results.length > 0 && (
                <div
                    style={{
                        marginTop: 6,
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        maxHeight: 180,
                        overflowY: "auto",
                        background: "#fff",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                    }}
                >
                    {results.map((marker) => (
                        <button
                            key={marker.id}
                            type="button"
                            onClick={() => onResultClick(marker)}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "6px 10px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: 13,
                                color: "#222",
                                display: "flex",
                                flexDirection: "column",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f3f4f6";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>{marker.name}</span>
                            <span style={{ fontSize: 11, color: "#6b7280" }}>{marker.type}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}