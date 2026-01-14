import type { Marker } from "./types";

type MarkerJson = Omit<Marker, "isTemporary">;

export class MarkerController
{
    markers: Marker[] = [];
    selectedMarker: Marker | null = null;

    async loadFromJson(path: string)
    {
        const data = (await (await fetch(path)).json()) as MarkerJson[];

        this.markers = data.map(m => ({
            ...m,
            type: m.type ?? "Landmark",
            isTemporary: false,
        }));

        return this.markers;
    }

    getMarkers()
    {
        return this.markers;
    }

    placeMarker(x: number, y: number, props: Partial<Marker> = {}): Marker
    {
        const marker: Marker = {
            id: "",
            x,
            y,
            type: props.type ?? "Other",
            name: props.name || "New Marker",
            description: props.description || "",
            isApproximate: props.isApproximate ?? false,
            approximationNote: props.approximationNote,
            isVisible: props.isVisible ?? true,
            tags: props.tags || [],
            isTemporary: props.isTemporary ?? true,
        };

        this.markers.push(marker);
        return marker;
    }

    selectMarker(id: string | null)
    {
        this.selectedMarker = this.markers.find(m => m.id === id) || null;
    }

    deleteMarker(id: string)
    {
        this.markers = this.markers.filter(m => m.id !== id);
        if (this.selectedMarker?.id === id) this.selectedMarker = null;
    }
}