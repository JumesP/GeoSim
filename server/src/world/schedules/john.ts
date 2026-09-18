import type { ScheduleEntry } from "../schedule.js";

export const johnSchedule: ScheduleEntry[] = [
    {
        startHour: 0,
        endHour: 7,
        activity: "sleeping",
        locationType: "home"
    },
    {
        startHour: 7,
        endHour: 8,
        activity: "waking",
        locationType: "home"
    },
    {
        startHour: 8,
        endHour: 8.5,
        activity: "travelling",
        locationType: "work"
    },
    {
        startHour: 8.5,
        endHour: 12,
        activity: "working",
        locationType: "work"
    },
    {
        startHour: 12,
        endHour: 13,
        activity: "lunch",
        locationType: "work"
    },
    {
        startHour: 13,
        endHour: 17,
        activity: "working",
        locationType: "work"
    },
    {
        startHour: 17,
        endHour: 17.5,
        activity: "travelling",
        locationType: "home"
    },
    {
        startHour: 17.5,
        endHour: 23,
        activity: "at_home",
        locationType: "home"
    }
];
