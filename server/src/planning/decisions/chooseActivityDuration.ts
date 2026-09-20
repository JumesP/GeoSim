import type { ScheduleActivity } from "../../world/schedule.js";
import { chooseWeighted } from "../weightedChoice.js";
import { activityDurations } from "../data/activityDurations.js";

export function chooseActivityDuration(
    activity: ScheduleActivity,
    maxMinutes?: number
): number | null {
    const options = activityDurations[activity];

    if (!options) {
        return null;
    }

    const availableOptions =
        maxMinutes === undefined
            ? options
            : options.filter(
                option =>
                    option.minutes <= maxMinutes
            );

    if (availableOptions.length === 0) {
        return null;
    }

    return chooseWeighted(
        availableOptions.map(option => ({
            value: option.minutes,
            weight: option.weight
        }))
    );
}
