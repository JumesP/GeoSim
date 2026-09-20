import type { ScheduleLocation } from "../world/schedule.js";
import type { SequentialPlanEntry } from "./generateSequentialPlan.js";

export function createWaitingPlanEntry(
    startTime: Date,
    endTime: Date,
    locationId: string,
    location: ScheduleLocation
): SequentialPlanEntry {
    return {
        startTime,
        endTime,
        activity: "waiting",
        location,
        locationId,
        priority: "low"
    };
}
