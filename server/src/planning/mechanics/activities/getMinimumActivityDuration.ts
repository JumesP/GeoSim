import type { ScheduleActivity } from "../../../world/schedules/schedule.js";
import { activityDurations } from "../../data/activities/activityDurations.js";

export function getMinimumActivityDuration(
    activity: ScheduleActivity
): number | null {
    const options = activityDurations[activity];

    if (!options || options.length === 0) {
        return null;
    }

    return Math.min(
        ...options.map(option => option.minutes)
    );
}
