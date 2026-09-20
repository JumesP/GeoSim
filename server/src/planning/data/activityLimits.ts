import type { ScheduleActivity } from "../../world/schedule.js";

export type ActivityLimit = {
    max: number;
};

export const activityLimits:
    Partial<Record<ScheduleActivity, ActivityLimit>> = {
    exercising: {
        max: 2
    },

    shopping: {
        max: 1
    },

    socialising: {
        max: 2
    }
};
