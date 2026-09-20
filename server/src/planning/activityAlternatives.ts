import type {
    ScheduleActivity,
    ScheduleLocation
} from "../world/schedule.js";

export type ActivityAlternative = {
    activity: ScheduleActivity;
    location: ScheduleLocation;
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
            }
        },
        {
            activity: "exercising",
            location: {
                relationship: "regular",
                type: "park"
            }
        }
    ],

    socialising: [
        {
            activity: "at_home",
            location: {
                relationship: "home"
            }
        }
    ]
};
