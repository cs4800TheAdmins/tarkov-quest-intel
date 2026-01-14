export type Position = {
    x: number;
    y: number;
    z: number;
}

export type Spawn = {
    zoneName: string;
    sides: string[];
    categories: string[];
    position: Position;
}

export type Extract = {
    id: string;
    name: string;
    position: Position;
}

export type Transit = {
    id: string;
    description: string;
    map?: {
        name: string;
    } | null;
    position: Position;
}

export type Lock = {
    lockType: string;
    needsPower: boolean;
    key?: {
        id: string;
        name: string;
    } | null;
    position: Position;
}

export type Switch = {
    id: string;
    name: string;
    switchType: string;
    activatedBy?: {
        name: string;
    } | null;
    position: Position;
}

export type Hazard = {
    hazardType: string;
    name?: string;
    position: Position;
}

export type LootContainer = {
    lootContainer?: {
        id: string;
        name: string;
        normalizedName: string;
    } | null;
    position: Position;
}

export type LootLoose = {
    items: {
        id: string;
        name: string;
    }[];
    position: Position;
}

export type StationaryWeapon = {
    stationaryWeapon?: {
        id: string;
        name: string;
        shortName: string;
    } | null;
    position: Position;
}

export type BtrStop = {
    name: string;
    x: number;
    y: number;
    z: number;
}

export type MapData = {
    id: string;
    name: string;
    normalizedName: string;

    extracts?: Extract[] | null;
    spawns?: Spawn[] | null;
    transits?: Transit[] | null;
    locks?: Lock[] | null;
    switches?: Switch[] | null;
    hazards?: Hazard[] | null;
    lootContainers?: LootContainer[] | null;
    lootLoose?: LootLoose[] | null;
    stationaryWeapons?: StationaryWeapon[] | null;
    btrStops?: BtrStop[] | null;
}

export type QueryResponse = {
    maps: MapData[];
}