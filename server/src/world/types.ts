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

export type PersonStatus =
    | "sleeping"
    | "waking"
    | "at_home"
    | "working"
    | "eating"
    | "shopping"
    | "exercising"
    | "socialising"
    | "travelling";

export type Person = {
    id: string;
    name: string;
    age: number;

    homeId: string;
    workplaceId: string;

    currentLocation: Coordinate;

    status: PersonStatus;

    destinationId: string | null;

    schedule: ScheduleEntry[];

    movement: {
        origin: Coordinate;
        destination: Coordinate;
        departureTime: Date;
        arrivalTime: Date;
    } | null;
};
