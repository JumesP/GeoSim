import type { ScheduleEntry } from "../world/schedule.js";
import { getScheduleDecimalHour } from "./scheduleTime.js";

export function getCurrentScheduleEntry(
    schedule: ScheduleEntry[],
    date: Date
): ScheduleEntry | undefined {
    const decimalHour =
        getScheduleDecimalHour(date);

    return schedule.find(entry =>
        decimalHour >= entry.startHour &&
        decimalHour < entry.endHour
    );
}
