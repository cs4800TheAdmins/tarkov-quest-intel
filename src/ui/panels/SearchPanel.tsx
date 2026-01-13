import { useState } from "react";

export default function SearchPanel() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Search by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
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
            {searchQuery && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 4, paddingLeft: 2 }}>
                    Searching: <strong style={{ color: "#333" }}>{searchQuery}</strong>
                </div>
            )}
        </div>
    );
}