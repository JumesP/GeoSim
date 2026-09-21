import type { SequentialPlanEntry } from "../generateSequentialPlan.js";

export function cutPlanEntry(
    entry: SequentialPlanEntry,
    minutes: number
): SequentialPlanEntry | null {
    const durationMinutes =
        (entry.endTime.getTime() -
            entry.startTime.getTime()) /
        (60 * 1000);

    const remainingMinutes =
        durationMinutes - minutes;

    if (remainingMinutes <= 0) {
        return null;
    }

    return {
        ...entry,
        endTime: new Date(
            entry.endTime.getTime() -
            minutes * 60 * 1000
        )
    };
}
