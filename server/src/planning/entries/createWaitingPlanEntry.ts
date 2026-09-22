import type { ScheduleLocation } from "../../world/schedules/schedule.js";
import type { SequentialPlanEntry } from "../SequentialPlan.js";

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
        idleActivity: undefined,
        location,
        locationId,
        priority: "low"
    };
}
