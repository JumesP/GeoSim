import type { ScheduleEntry } from "../world/schedule.js";

export function getCurrentScheduleEntry(
    schedule: ScheduleEntry[],
    date: Date
): ScheduleEntry | undefined {
    const hour =
        date.getHours() +
        date.getMinutes() / 60;

    return schedule.find(entry =>
        hour >= entry.startHour &&
        hour < entry.endHour
    );
}
