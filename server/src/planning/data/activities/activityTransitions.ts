import type { ScheduleActivity } from "../../../world/schedules/schedule.js";

export type ActivityTransitionWeights =
    Partial<Record<ScheduleActivity, number>>;

export const activityTransitions:
    Partial<
        Record<
            ScheduleActivity,
            ActivityTransitionWeights
        >
    > = {
    waking: {
        at_home: 100,
        working: 60,
        socialising: 10,
        exercising: 10
    },

    working: {
        at_home: 70,
        socialising: 30,
        exercising: 20,
        shopping: 10
    },

    shopping: {
        at_home: 80,
        socialising: 20,
        exercising: 10
    },

    exercising: {
        at_home: 70,
        socialising: 30,
        shopping: 10
    },

    socialising: {
        at_home: 70,
        shopping: 10,
        exercising: 10,
        sleeping: 200
    },

    at_home: {
        working: 30,
        shopping: 20,
        exercising: 20,
        socialising: 20,
        at_home: 10,
        sleeping: 80
    }
};
