import { useMemo, useState } from "react";

export default function SearchPanel() {
    const [query, setQuery] = useState("");
    const trimmed = useMemo(() => query.trim(), [query]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search markers..."
                    aria-label="Search markers"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px 36px 10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d0d0d0",
                        fontSize: 14,
                        outline: "none",
                        background: "#fff",
                        color: "#222",
                    }}
                />

                {query.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        title="Clear"
                        style={{
                            position: "absolute",
                            right: 6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            lineHeight: 1,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f1f1f1";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        ×
                    </button>
                )}
            </div>

            <div style={{ fontSize: 12, color: "#666" }}>
                {trimmed ? (
                    <>
                        Searching for: <strong style={{ color: "#222" }}>{trimmed}</strong>
                    </>
                ) : (
                    <>Type to search by name, description, or tags.</>
                )}
            </div>
        </div>
    );
}