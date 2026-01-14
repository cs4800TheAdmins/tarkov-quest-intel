import { useMemo, useState } from "react";
import type { MarkerType } from "../../domain/types";

const MARKER_TYPES: MarkerType[] = [
    "QuestItem",
    "Landmark",
    "Extraction",
    "BossSpawn",
    "KeyLocation",
    "Other",
];

export default function FilterPanel() {
    const [selectedTypes, setSelectedTypes] = useState<Set<MarkerType>>(
        () => new Set(MARKER_TYPES),
    );
    const [showApproximate, setShowApproximate] = useState(true);
    const [showHidden, setShowHidden] = useState(true);

    const allSelected = useMemo(
        () => selectedTypes.size === MARKER_TYPES.length,
        [selectedTypes],
    );

    const toggleType = (type: MarkerType) => {
        setSelectedTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
    };

    const selectAll = () => setSelectedTypes(new Set(MARKER_TYPES));
    const selectNone = () => setSelectedTypes(new Set());

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    type="button"
                    onClick={allSelected ? selectNone : selectAll}
                    style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d0d0d0",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                        color: "#222",
                    }}
                    title={allSelected ? "Clear all types" : "Select all types"}
                >
                    {allSelected ? "Clear all" : "Select all"}
                </button>

                <button
                    type="button"
                    onClick={selectNone}
                    style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d0d0d0",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                        color: "#222",
                    }}
                    title="Select none"
                >
                    None
                </button>
            </div>

            <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>
                    Marker Types
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {MARKER_TYPES.map((type) => (
                        <label
                            key={type}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontSize: 14,
                                color: "#222",
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.has(type)}
                                onChange={() => toggleType(type)}
                                style={{ width: 16, height: 16, cursor: "pointer" }}
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>
                    Options
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 14,
                            color: "#222",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showApproximate}
                            onChange={(e) => setShowApproximate(e.target.checked)}
                            style={{ width: 16, height: 16, cursor: "pointer" }}
                        />
                        <span>Show approximate locations</span>
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 14,
                            color: "#222",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showHidden}
                            onChange={(e) => setShowHidden(e.target.checked)}
                            style={{ width: 16, height: 16, cursor: "pointer" }}
                        />
                        <span>Show hidden markers</span>
                    </label>
                </div>
            </div>

            <div style={{ fontSize: 12, color: "#666" }}>
                Selected types: <strong style={{ color: "#222" }}>{selectedTypes.size}</strong>
                {selectedTypes.size === 0 && " (none)"}
                {!showApproximate && " • hiding approximate"}
                {!showHidden && " • hiding hidden"}
            </div>
        </div>
    );
}