import type { Person } from "../person/Person.js";
import type {
    DailyPlan,
    DailyPlanDecision
} from "./DailyPlan.js";
import {
    johnActivityProbabilities
} from "./personPlanning.js";
import {
    rollProbability
} from "./utilities/probability.js";
import {
    applyDailyPlanDecisions
} from "./applyDailyPlanDecisions.js";

export function generateDailyPlan(
    person: Person,
    date: Date
): DailyPlan {
    const dateString =
        new Intl.DateTimeFormat("en-CA", {
            timeZone: "Europe/London",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(date);

    const decisions: DailyPlanDecision[] = [];

    for (
        let index = 0;
        index < person.schedule.length;
        index++
    ) {
        const entry = person.schedule[index];

        const probability =
            johnActivityProbabilities[
                entry.activity
            ];

        if (probability === undefined) {
            continue;
        }

        decisions.push({
            entryIndex: index,
            activity: entry.activity,
            probability,
            selected: rollProbability(
                probability
            )
        });
    }

    const plan: DailyPlan = {
        date: dateString,

        entries: person.schedule.map(entry => {
            const {
                optional: _optional,
                ...plannedEntry
            } = entry;

            return {
                ...plannedEntry,
                date: dateString
            };
        }),

        decisions
    };

    return applyDailyPlanDecisions(plan);
}
