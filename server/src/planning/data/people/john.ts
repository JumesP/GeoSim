import type { ScheduleActivity } from "../../../world/schedule.js";

export type ActivityPreferences =
    Partial<Record<ScheduleActivity, number>>;

export type LocationPreferences =
    Partial<
        Record<
            ScheduleActivity,
            Record<string, number>
        >
    >;

export const johnLocationPreferences:
    LocationPreferences = {
    shopping: {
        "tesco-heelands": 80
    },

    socialising: {
        "edo-coffee": 100,
        "victoria-inn": 90
    },

    exercising: {
        "park": 60
    }
};

export const johnActivityPreferences:
    ActivityPreferences = {
    sleeping: 100,
    waking: 100,
    working: 80,
    at_home: 45,
    shopping: 20,
    socialising: 20,
    exercising: 10
};
