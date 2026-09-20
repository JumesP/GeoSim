import type { ScheduleEntry } from "../world/schedule.js";

export type DailyPlanEntry = Omit<
    ScheduleEntry,
    "optional"
> & {
    date: string;
};

export type DailyPlanDecision = {
    entryIndex: number;
    activity: ScheduleEntry["activity"];
    probability: number;
    selected: boolean;
};

export type DailyPlan = {
    date: string;
    entries: DailyPlanEntry[];
    decisions: DailyPlanDecision[];
};
