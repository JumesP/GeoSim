import type { ScheduleActivity } from "../../../world/schedules/schedule.js";

export type ActivityTimeWindow = {
    startHour: number;
    endHour: number;
};

export const activityTimeWindows:
    Partial<Record<ScheduleActivity, ActivityTimeWindow>> = {
    shopping: {
        startHour: 9,
        endHour: 21
    },

    exercising: {
        startHour: 7,
        endHour: 22
    },

    socialising: {
        startHour: 11,
        endHour: 23
    }
};
