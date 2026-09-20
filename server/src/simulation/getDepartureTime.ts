import type { ScheduleEntry } from "../world/schedule.js";

const SCHEDULE_TIME_ZONE = "Europe/London";

function getTimeZoneOffset(
    date: Date,
    timeZone: string
): number {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts
            .filter(part => part.type !== "literal")
            .map(part => [
                part.type,
                Number(part.value)
            ])
    );

    const asUTC = Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        values.hour,
        values.minute,
        values.second
    );

    return asUTC - date.getTime();
}

export function getDepartureTime(
    scheduleEntry: ScheduleEntry,
    currentTime: Date,
    travelTimeMinutes: number
): Date {
    const startHour =
        Math.floor(scheduleEntry.startHour);

    const startMinute =
        Math.round(
            (scheduleEntry.startHour - startHour) * 60
        );

    /*
     * Start with the current date expressed in
     * Europe/London.
     */
    const londonParts =
        new Intl.DateTimeFormat("en-GB", {
            timeZone: SCHEDULE_TIME_ZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(currentTime);

    const values = Object.fromEntries(
        londonParts
            .filter(part => part.type !== "literal")
            .map(part => [
                part.type,
                Number(part.value)
            ])
    );

    /*
     * Treat the schedule time as London local time.
     */
    const scheduleAsUTC = Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        startHour,
        startMinute,
        0
    );

    /*
     * Convert the London-local timestamp into
     * the equivalent real UTC timestamp.
     */
    const offset = getTimeZoneOffset(
        new Date(scheduleAsUTC),
        SCHEDULE_TIME_ZONE
    );

    const activityStartTime =
        scheduleAsUTC - offset;

    return new Date(
        activityStartTime -
        travelTimeMinutes * 60 * 1000
    );
}
