import type { LocationType } from "./types.js";

export type ScheduleActivity =
    | "sleeping"
    | "waking"
    | "working"
    | "lunch"
    | "travelling"
    | "at_home";

export type ScheduleEntry = {
    startHour: number;
    endHour: number;
    activity: ScheduleActivity;
    locationType: LocationType;
};
