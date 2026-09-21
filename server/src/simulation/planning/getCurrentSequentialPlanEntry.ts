import type { SequentialPlanEntry } from "../../planning/generateSequentialPlan.js";

export function getCurrentSequentialPlanEntry(
    plan: SequentialPlanEntry[],
    currentTime: Date
): SequentialPlanEntry | null {
    return (
        plan.find(
            entry =>
                currentTime >= entry.startTime &&
                currentTime < entry.endTime
        ) ?? null
    );
}
