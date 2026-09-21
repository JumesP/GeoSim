import type { ScheduleActivity } from "../../../world/schedules/schedule.js";
import type { LocationType } from "../../../world/types.js";

export const activityLocationTypes:
    Partial<Record<ScheduleActivity, LocationType[]>> = {
    shopping: ["shop"],
    exercising: ["park", "gym"],
    socialising: ["restaurant"],
};
