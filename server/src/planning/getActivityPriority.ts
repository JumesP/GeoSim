import type { ScheduleActivity } from "../world/schedule.js";
import type { PlanPriority } from "./planPriority.js";

export function getActivityPriority(
    activity: ScheduleActivity
): PlanPriority {
    switch (activity) {
        case "working":
            return "high";

        case "sleeping":
            return "high";

        case "exercising":
        case "socialising":
        case "shopping":
        case "lunch":
            return "normal";

        case "waking":
        case "at_home":
            return "low";
        case "waiting":
            return "low";

        default:
            return "normal";
    }
}
