import type { LocationType } from "./types.js";
import type { PersonLocation } from "../person/Person.js";

export type ScheduleActivity =
    | "sleeping"
    | "waking"
    | "working"
    | "lunch"
    | "shopping"
    | "exercising"
    | "socialising"
    | "travelling"
    | "at_home";

export type ScheduleEntry = {
    startHour: number;
    endHour: number;
    activity: ScheduleActivity;
    location: ScheduleLocation;
    optional?: boolean;
};

export type ScheduleLocation =
    | {
        relationship: "home" | "work";
    }
    | {
        relationship: "favourite" | "regular";
        type: LocationType;
    };
