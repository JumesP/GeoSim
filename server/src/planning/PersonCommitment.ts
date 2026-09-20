import type { ScheduleActivity } from "../world/schedule.js";

export type PersonCommitment = {
    activity: ScheduleActivity;
    locationId: string;
    startHour: number;
    endHour: number;
    daysOfWeek: number[];
};
