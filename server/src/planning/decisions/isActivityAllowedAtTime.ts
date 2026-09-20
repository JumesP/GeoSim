import type { ScheduleActivity } from "../../world/schedule.js";
import { activityTimeWindows } from "../data/activityTimeWindows.js";

export function isActivityAllowedAtTime(
    activity: ScheduleActivity,
    currentHour: number
): boolean {
    const window = activityTimeWindows[activity];

    if (!window) {
        return true;
    }

    return (
        currentHour >= window.startHour &&
        currentHour < window.endHour
    );
}
