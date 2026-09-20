import type { SequentialPlanEntry } from "./generateSequentialPlan.js";
import {
    planPriorityValues
} from "./planPriority.js";

export function comparePlanPriority(
    first: SequentialPlanEntry,
    second: SequentialPlanEntry
): SequentialPlanEntry | null {
    // returned value is the entry with the lower priority, meaning its the one whos time is cut into
    if (
        first.priority === "fixed" &&
        second.priority === "fixed"
    ) {
        return null;
    }

    if (first.priority === "fixed") {
        return second;
    }

    if (second.priority === "fixed") {
        return first;
    }

    const firstPriority =
        planPriorityValues[first.priority];

    const secondPriority =
        planPriorityValues[second.priority];

    if (firstPriority <= secondPriority) {
        return first;
    }

    return second;
}
