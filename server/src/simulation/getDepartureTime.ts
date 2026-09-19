import type { ScheduleEntry } from "../world/schedule.js";

export function getDepartureTime(
    scheduleEntry: ScheduleEntry,
    currentTime: Date,
    travelTimeMinutes: number
): Date {
    const departureTime = new Date(currentTime);

    const startHour = Math.floor(scheduleEntry.startHour);
    const startMinute = Math.round(
        (scheduleEntry.startHour - startHour) * 60
    );

    departureTime.setHours(
        startHour,
        startMinute,
        0,
        0
    );

    departureTime.setTime(
        departureTime.getTime() -
        travelTimeMinutes * 60 * 1000
    );

    return departureTime;
}
