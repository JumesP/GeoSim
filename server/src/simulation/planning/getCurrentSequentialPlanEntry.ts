import type { SequentialPlanEntry } from "../../planning/SequentialPlan.js";

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
