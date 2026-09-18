import type { ScheduleEntry } from "../world/schedule.js";

export function getCurrentScheduleEntry(
    schedule: ScheduleEntry[],
    date: Date
): ScheduleEntry | undefined {
    const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(date);

    const hour = Number(
        time.find(part => part.type === "hour")?.value
    );

    const minute = Number(
        time.find(part => part.type === "minute")?.value
    );

    const decimalHour = hour + minute / 60;

    return schedule.find(entry =>
        decimalHour >= entry.startHour &&
        decimalHour < entry.endHour
    );
}
