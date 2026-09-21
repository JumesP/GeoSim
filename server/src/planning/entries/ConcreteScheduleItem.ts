import type { ScheduleActivity } from "../../world/schedules/schedule.js";

export type ConcreteScheduleItem = {
    activity: ScheduleActivity;
    locationId: string;
    startTime: Date;
    endTime: Date;
};
