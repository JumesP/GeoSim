import type { SequentialPlanEntry } from "../generateSequentialPlan.js";

export function printSequentialPlan(
    plan: SequentialPlanEntry[]
): void {
    for (const entry of plan) {
        console.log(
            `${formatTime(entry.startTime)} → ` +
            `${formatTime(entry.endTime)} ` +
            `${entry.activity} ` +
            `(${entry.locationId})`
        );
    }
}

function formatTime(time: Date): string {
    return time.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}
