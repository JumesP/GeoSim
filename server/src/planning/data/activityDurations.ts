import type { ScheduleActivity } from "../../world/schedule.js";

export type DurationOption = {
    minutes: number;
    weight: number;
};

export const activityDurations:
    Partial<Record<
        ScheduleActivity,
        DurationOption[]
    >> = {
    sleeping: [ // this is specifically for after 6:00am
        { minutes: 30, weight: 20 },
        { minutes: 60, weight: 40 },
        { minutes: 120, weight: 30 },
        { minutes: 180, weight: 10 }
    ],

    working: [
        { minutes: 420, weight: 70 },
        { minutes: 480, weight: 30 }
    ],

    shopping: [
        { minutes: 30, weight: 50 },
        { minutes: 60, weight: 40 },
        { minutes: 90, weight: 10 }
    ],

    exercising: [
        { minutes: 30, weight: 40 },
        { minutes: 60, weight: 50 },
        { minutes: 90, weight: 10 }
    ],

    socialising: [
        { minutes: 60, weight: 30 },
        { minutes: 120, weight: 50 },
        { minutes: 180, weight: 20 }
    ],

    at_home: [
        { minutes: 60, weight: 30 },
        { minutes: 120, weight: 40 },
        { minutes: 180, weight: 30 }
    ],

    lunch: [
        { minutes: 30, weight: 60 },
        { minutes: 60, weight: 40 }
    ],

    waking: [
        { minutes: 30, weight: 60 },
        { minutes: 60, weight: 40 }
    ]
};
