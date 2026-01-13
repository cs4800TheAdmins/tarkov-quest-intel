import type { Marker } from "../../domain/types";

interface MarkerDetailPanelProps {
    marker?: Marker | null;
}

export default function MarkerDetailPanel({ marker }: MarkerDetailPanelProps = {}) {
    if (!marker) {
        return (
            <div style={{ 
                color: "#999", 
                fontSize: 14, 
                padding: "32px 0",
                textAlign: "center",
                fontStyle: "italic"
            }}>
                Click on a marker to view details
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600, color: "#333" }}>
                    {marker.name}
                </h3>
                {marker.isApproximate && (
                    <div
                        style={{
                            fontSize: 13,
                            color: "#ff8c00",
                            marginBottom: 4,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        ⚠ Approximate Location
                    </div>
                )}
            </div>

            <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 600, color: "#444" }}>
                    Description
                </h4>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#333" }}>
                    {marker.description}
                </p>
                {marker.approximationNote && (
                    <div
                        style={{
                            margin: "12px 0 0 0",
                            padding: "10px",
                            fontSize: 13,
                            lineHeight: 1.5,
                            color: "#666",
                            backgroundColor: "#f9f9f9",
                            borderRadius: 6,
                            borderLeft: "3px solid #ff8c00",
                        }}
                    >
                        <strong style={{ color: "#555" }}>Note:</strong> {marker.approximationNote}
                    </div>
                )}
            </div>

            <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 600, color: "#444" }}>
                    Location Coordinates
                </h4>
                <div style={{ 
                    fontSize: 13, 
                    color: "#555", 
                    fontFamily: "monospace",
                    padding: "8px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 4,
                }}>
                    X: {marker.x.toFixed(2)}, Y: {marker.y.toFixed(2)}
                </div>
            </div>

            {marker.tags.length > 0 && (
                <div>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 600, color: "#444" }}>
                        Tags
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {marker.tags.map(tag => (
                            <span
                                key={tag.id}
                                style={{
                                    fontSize: 12,
                                    padding: "6px 12px",
                                    backgroundColor: "#e8e8e8",
                                    borderRadius: 6,
                                    color: "#333",
                                    fontWeight: 500,
                                }}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ 
                paddingTop: 12,
                borderTop: "1px solid #e0e0e0",
            }}>
                <div style={{ fontSize: 13, color: "#666" }}>
                    <strong>Status:</strong> <span style={{ color: marker.isVisible ? "#28a745" : "#999" }}>
                        {marker.isVisible ? "Visible" : "Hidden"}
                    </span>
                </div>
            </div>
        </div>
    );
}