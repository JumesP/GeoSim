import type { ScheduleActivity } from "../world/schedules/schedule.js";

export type ActivityProbabilities =
    Partial<Record<ScheduleActivity, number>>;

export const johnActivityProbabilities:
    ActivityProbabilities = {
    shopping: 0.7,
    socialising: 0.6,
    exercising: 0.4
};
