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
    profilePicture: string;

    locations: PersonLocation[];

    currentLocation: Coordinate;

    status: PersonStatus;

    destinationId: string | null;

    travelMode: TravelMode;

    schedule: ScheduleEntry[];

    movement: {
        origin: Coordinate;
        destination: Coordinate;
        departureTime: Date;
        arrivalTime: Date;
    } | null;

    movementSpeed: {
        walking: 1.4,
        cycling: 4.5,
        driving: 12
    };
};

export type TravelMode =
    | "walking"
    | "cycling"
    | "driving";

export type PersonLocation = {
    locationId: string;
    relationship:
        | "home"
        | "work"
        | "favourite"
        | "regular";
};
