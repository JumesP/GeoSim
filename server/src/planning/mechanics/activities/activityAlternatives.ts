import type {
    ScheduleActivity,
    ScheduleLocation
} from "../../../world/schedules/schedule.js";

export type ActivityAlternative = {
    activity: ScheduleActivity;
    location: ScheduleLocation;
    weight: number;
};

export const activityAlternatives:
    Partial<Record<
        ScheduleActivity,
        ActivityAlternative[]
    >> = {
    shopping: [
        {
            activity: "at_home",
            location: {
                relationship: "home"
            },
            weight: 60
        },
        {
            activity: "exercising",
            location: {
                relationship: "regular",
                type: "park"
            },
            weight: 40
        }
    ],

    socialising: [
        {
            activity: "at_home",
            location: {
                relationship: "home"
            },
            weight: 100
        }
    ]
};
