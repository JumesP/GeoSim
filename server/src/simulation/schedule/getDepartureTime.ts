import type { SequentialPlanEntry } from "../../planning/SequentialPlan.js";

export function getDepartureTime(
    scheduleEntry: SequentialPlanEntry,
    currentTime: Date,
    travelTimeMinutes: number
): Date {
    return new Date(
        scheduleEntry.startTime.getTime() -
        travelTimeMinutes * 60 * 1000
    );
}
