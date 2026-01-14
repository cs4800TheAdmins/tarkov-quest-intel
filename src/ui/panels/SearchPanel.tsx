type SearchPanelProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchPanel({ value, onChange }: SearchPanelProps) {
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
            {value && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 4, paddingLeft: 2 }}>
                    Searching: <strong style={{ color: "#333" }}>{value}</strong>
                </div>
            )}
        </div>
    );
}