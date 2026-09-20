import type { DailyPlan } from "./DailyPlan.js";
import { activityAlternatives } from "./activityAlternatives.js";
import { chooseWeighted } from "./weightedChoice.js";

export function applyDailyPlanDecisions(
    plan: DailyPlan
): DailyPlan {
    const entries = plan.entries.map((entry, index) => {
        const decision =
            plan.decisions.find(
                decision =>
                    decision.entryIndex === index
            );

        if (!decision || decision.selected) {
            return entry;
        }

        const alternatives =
            activityAlternatives[entry.activity];

        if (!alternatives || alternatives.length === 0) {
            return entry;
        }

        const alternative = chooseWeighted(
            alternatives.map(option => ({
                value: option,
                weight: option.weight
            }))
        );

        if (!alternative) {
            return entry;
        }

        return {
            startHour: entry.startHour,
            endHour: entry.endHour,
            activity: alternative.activity,
            location: alternative.location,
            date: entry.date
        };
    });

    return {
        ...plan,
        entries
    };
}
