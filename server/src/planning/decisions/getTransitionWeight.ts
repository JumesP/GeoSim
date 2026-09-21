import type { ScheduleActivity } from "../../world/schedules/schedule.js";
import { activityTransitions } from "../data/activities/activityTransitions.js";

export function getTransitionWeight(
    previousActivity: ScheduleActivity | null,
    activity: ScheduleActivity
): number {
    if (!previousActivity) {
        return 1;
    }

    return (
        activityTransitions[
            previousActivity
        ]?.[activity] ?? 1
    );
}
