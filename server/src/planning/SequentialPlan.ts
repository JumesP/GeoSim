import type { ScheduleActivity, ScheduleLocation } from "../world/schedules/schedule.js";
import type { PlanPriority } from "./mechanics/planPriority.js";
import type { IdleActivity } from "./idle/IdleActivity.js";

export type SequentialPlanEntry = {
    startTime: Date;
    endTime: Date;
    activity: ScheduleActivity | "travelling";
    idleActivity?: IdleActivity;
    location: ScheduleLocation;
    locationId: string;
    priority: PlanPriority;
};

export type SequentialPlan = {
    date: Date;
    entries: SequentialPlanEntry[];
};
