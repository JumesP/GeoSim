import type { Coordinate } from "../../world/types.js";
import type { ScheduleLocation } from "../../world/schedules/schedule.js";
import type { SequentialPlanEntry } from "../generateSequentialPlan.js";

export function createTravelPlanEntry(
    startTime: Date,
    endTime: Date,
    locationId: string,
    location: ScheduleLocation
): SequentialPlanEntry {
    return {
        startTime,
        endTime,
        activity: "travelling",
        location,
        locationId,
        priority: "fixed"
    };
}
