import type { ScheduleActivity } from "../../../world/schedules/schedule.js";
import type { PersonCommitment } from "../../entries/PersonCommitment.js";

export type ActivityPreferences =
    Partial<Record<ScheduleActivity, number>>;

export type LocationPreferences =
    Partial<
        Record<
            ScheduleActivity,
            Record<string, number>
        >
    >;

export const johnLocationPreferences: LocationPreferences = {
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

export const johnActivityPreferences: ActivityPreferences = {
    sleeping: 100,
    waking: 100,
    working: 80,
    at_home: 45,
    shopping: 20,
    socialising: 20,
    exercising: 10
};

export const johnCommitments: PersonCommitment[] = [
    {
        activity: "working",
        locationId: "office",
        startHour: 9,
        endHour: 17,
        daysOfWeek: [1, 2, 3, 4, 5]
    }
];
