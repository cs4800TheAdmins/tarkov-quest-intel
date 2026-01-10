import type {GameMap, MapState, Point} from "./types";

export class MapController
{
    private state: MapState;
    public dragging: boolean;

    private readonly map: GameMap;
    private containerWidth: number;
    private containerHeight: number;

    private dragStart: Point;
    private lastPosition: Point;

    constructor(map: GameMap, containerWidth: number, containerHeight: number)
    {
        this.map = map;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;

        this.state = {
            centerX: 0,
            centerY: 0,
            zoomLevel: 0.5,
            minZoom: 0.5,
            maxZoom: 1,
            isDragging: false,
        };

        this.dragging = false;
        this.dragStart = {x: 0, y: 0};
        this.lastPosition = {x: 0, y: 0};

        const clamped = this.clamp(0, 0);
        this.state.centerX = clamped.x;
        this.state.centerY = clamped.y;
    }

    get zoom()
    {
        return this.state.zoomLevel;
    }

    get position(): Point
    {
        return {x: this.state.centerX, y: this.state.centerY};
    }

    public updateContainerSize(width: number, height: number)
    {
        this.containerWidth = width;
        this.containerHeight = height;

        const clamped = this.clamp(this.state.centerX, this.state.centerY);
        this.state.centerX = clamped.x;
        this.state.centerY = clamped.y;
    }

    private clamp(x: number, y: number): Point
    {
        const mapW = this.map.widthPx * this.state.zoomLevel;
        const mapH = this.map.heightPx * this.state.zoomLevel;

        const excessW = this.containerWidth - mapW;
        const excessH = this.containerHeight - mapH;

        const minX = excessW < 0 ? excessW : excessW / 2;
        const maxX = excessW < 0 ? 0 : excessW / 2;

        const minY = excessH < 0 ? excessH : excessH / 2;
        const maxY = excessH < 0 ? 0 : excessH / 2;

        const clampedX = Math.max(minX, Math.min(maxX, x));
        const clampedY = Math.max(minY, Math.min(maxY, y));

        return {x: clampedX, y: clampedY};
    }

    public onMouseDown(localX: number, localY: number)
    {
        this.state.isDragging = true;
        this.dragging = true;
        this.dragStart = {x: localX, y: localY};
        this.lastPosition = {x: this.state.centerX, y: this.state.centerY};
    }

    public onMouseMove(localX: number, localY: number)
    {
        if (!this.state.isDragging) return;

        const dx = localX - this.dragStart.x;
        const dy = localY - this.dragStart.y;

        const newPos: Point = {
            x: this.lastPosition.x + dx,
            y: this.lastPosition.y + dy,
        };

        const clamped = this.clamp(newPos.x, newPos.y);
        this.state.centerX = clamped.x;
        this.state.centerY = clamped.y;
    }

    public onMouseUp()
    {
        this.state.isDragging = false;
        this.dragging = false;
    }

    public onWheel(localX: number, localY: number, deltaY: number)
    {
        let newZoom = this.state.zoomLevel - deltaY * 0.001;
        newZoom = Math.min(Math.max(newZoom, this.state.minZoom), this.state.maxZoom);

        const worldX = (localX - this.state.centerX) / this.state.zoomLevel;
        const worldY = (localY - this.state.centerY) / this.state.zoomLevel;

        this.state.zoomLevel = newZoom;

        const newX = localX - worldX * newZoom;
        const newY = localY - worldY * newZoom;

        const clamped = this.clamp(newX, newY);
        this.state.centerX = clamped.x;
        this.state.centerY = clamped.y;
    }

    public recenter()
    {
        this.state.zoomLevel = 0.5;
        const clamped = this.clamp(0, 0);
        this.state.centerX = clamped.x;
        this.state.centerY = clamped.y;
    }
}
