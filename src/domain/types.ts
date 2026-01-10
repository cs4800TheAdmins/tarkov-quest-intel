export type Point = {
    x: number;
    y: number;
};

export type Tag = {
    id: string;
    label: string;
}

export type Marker = {
    id: string;
    name: string;
    description: string;
    x: number;
    y: number;
    isApproximate: boolean;
    approximationNote?: string;
    isVisible: boolean;
    tags: Tag[];
    isTemporary: boolean;
    type: MarkerType;
}

export type MarkerType = "QuestItem" | "Landmark" | "Extraction" | "BossSpawn" | "KeyLocation" | "Other";

export type GameMap = {
    id: string;
    name: string;
    gameVersion: string;
    imageUrl: string;
    widthPx: number;
    heightPx: number;
    boundsMinX: number;
    boundsMinY: number;
    boundsMaxX: number;
    boundsMaxY: number;
}

export type MapState = {
    centerX: number;
    centerY: number;
    zoomLevel: number;
    minZoom: number;
    maxZoom: number;
    isDragging: boolean;
}
