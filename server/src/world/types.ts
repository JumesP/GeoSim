import type { ScheduleEntry } from "./schedule.js";

export type Coordinate = {
    latitude: number;
    longitude: number;
};

export type LocationType =
    | "home"
    | "work"
    | "shop"
    | "restaurant"
    | "park"
    | "gym"
    | "school";

export type WorldLocation = {
    id: string;
    name: string;
    type: LocationType;
    coordinate: Coordinate;
};
