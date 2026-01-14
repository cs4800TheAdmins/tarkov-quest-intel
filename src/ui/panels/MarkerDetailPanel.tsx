import type { Marker } from "../../domain/types";

interface MarkerDetailPanelProps {
    marker?: Marker | null;
}

export default function MarkerDetailPanel({ marker }: MarkerDetailPanelProps = {}) {
    if (!marker) {
        return (
            <div style={{ 
                color: "#888", 
                fontSize: 16, 
                padding: "40px 12px",
                textAlign: "center",
                fontStyle: "italic",
                lineHeight: 1.6,
            }}>
                Select a marker on the map to see quest details, notes, and coordinates.
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                padding: 12,
                borderRadius: 12,
                background: "linear-gradient(145deg, #ffffff, #f3f4f6)",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                border: "1px solid #e2e8f0",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <h3
                    style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#111827",
                        letterSpacing: 0.2,
                    }}
                >
                    {marker.name}
                </h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <span
                        style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            borderRadius: 999,
                            backgroundColor: "#e5f3ff",
                            color: "#1d4ed8",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                        }}
                    >
                        {marker.type}
                    </span>

                    {marker.isApproximate && (
                        <span
                            style={{
                                fontSize: 11,
                                padding: "4px 10px",
                                borderRadius: 999,
                                backgroundColor: "#fff7ed",
                                color: "#c05621",
                                fontWeight: 600,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <span aria-hidden="true">⚠</span>
                            Approximate
                        </span>
                    )}
                </div>
            </div>


            <div
                style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                }}
            >
                <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 600, color: "#111827" }}>
                    Description
                </h4>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
                    {marker.description}
                </p>
                {marker.approximationNote && (
                    <div
                        style={{
                            margin: "10px 0 0 0",
                            padding: "10px 12px",
                            fontSize: 13,
                            lineHeight: 1.5,
                            color: "#7c2d12",
                            backgroundColor: "#fffbeb",
                            borderRadius: 8,
                            borderLeft: "3px solid #f59e0b",
                        }}
                    >
                        <strong style={{ color: "#92400e" }}>Note:</strong> {marker.approximationNote}
                    </div>
                )}
            </div>


            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "10px 12px",
                    borderRadius: 10,
                    backgroundColor: "#f9fafb",
                    border: "1px dashed #d1d5db",
                }}
            >
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    Location (map coordinates)
                </h4>
                <div
                    style={{
                        display: "inline-flex",
                        gap: 16,
                        fontSize: 13,
                        color: "#374151",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    }}
                >
                    <span>X: {marker.x.toFixed(2)}</span>
                    <span>Y: {marker.y.toFixed(2)}</span>
                </div>
            </div>

            {marker.tags.length > 0 && (
                <div
                    style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        backgroundColor: "#f5f3ff",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <h4 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>
                        Tags
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {marker.tags.map(tag => (
                            <span
                                key={tag.id}
                                style={{
                                    fontSize: 12,
                                    padding: "6px 10px",
                                    backgroundColor: "#e0e7ff",
                                    borderRadius: 999,
                                    color: "#1e3a8a",
                                    fontWeight: 600,
                                }}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Status */}
            <div
                style={{
                    paddingTop: 10,
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#4b5563",
                }}
            >
                <span>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: marker.isVisible ? "#16a34a" : "#9ca3af", fontWeight: 600 }}>
                        {marker.isVisible ? "Visible" : "Hidden"}
                    </span>
                </span>
            </div>
        </div>
    );
}