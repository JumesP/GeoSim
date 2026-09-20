import type { ScheduleActivity } from "../../world/schedule.js";
import { chooseWeighted } from "../weightedChoice.js";
import { activityDurations } from "../data/activityDurations.js";

export function chooseActivityDuration(
    activity: ScheduleActivity
): number | null {
    const options = activityDurations[activity];

    if (!options) {
        return null;
    }

    return chooseWeighted(
        options.map(option => ({
            value: option.minutes,
            weight: option.weight
        }))
    );
}
