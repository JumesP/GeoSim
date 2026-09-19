import { ScheduleEntry } from "../schedule.js";

export const johnSchedule: ScheduleEntry[] = [
    {
        startHour: 0,
        endHour: 7,
        activity: "sleeping",
        location: {
            relationship: "home"
        }
    },
    {
        startHour: 7,
        endHour: 8,
        activity: "waking",
        location: {
            relationship: "home"
        }
    },
    {
        startHour: 8,
        endHour: 12,
        activity: "working",
        location: {
            relationship: "work"
        }
    },
    {
        startHour: 12,
        endHour: 13,
        activity: "lunch",
        location: {
            relationship: "work"
        }
    },
    {
        startHour: 13,
        endHour: 17.5,
        activity: "working",
        location: {
            relationship: "work"
        }
    },
    {
        startHour: 17.5,
        endHour: 19,
        activity: "shopping",
        location: {
            relationship: "regular",
            type: "shop"
        }
    },
    {
        startHour: 19,
        endHour: 21,
        activity: "socialising",
        location: {
            relationship: "favourite",
            type: "restaurant"
        }
    },
    {
        startHour: 21,
        endHour: 24,
        activity: "at_home",
        location: {
            relationship: "home"
        }
    }
];
