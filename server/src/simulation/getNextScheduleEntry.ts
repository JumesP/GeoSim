import type { ScheduleEntry } from "../world/schedule.js";

export function getNextScheduleEntry(
    schedule: ScheduleEntry[],
    currentTime: Date
): ScheduleEntry | undefined {
    const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(currentTime);

    const hour = Number(
        time.find(part => part.type === "hour")?.value
    );

    const minute = Number(
        time.find(part => part.type === "minute")?.value
    );

    const decimalHour = hour + minute / 60;

    const currentIndex = schedule.findIndex(
        entry =>
            decimalHour >= entry.startHour &&
            decimalHour < entry.endHour
    );

    if (currentIndex === -1) {
        return undefined;
    }

    return schedule[currentIndex + 1];
}
