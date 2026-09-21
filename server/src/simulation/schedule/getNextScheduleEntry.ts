import type { ScheduleEntry } from "../../world/schedules/schedule.js";
import { getScheduleDecimalHour } from "./scheduleTime.js";

export function getNextScheduleEntry(
    schedule: ScheduleEntry[],
    currentTime: Date
): ScheduleEntry | undefined {
    const decimalHour =
        getScheduleDecimalHour(currentTime);

    const currentIndex =
        schedule.findIndex(
            entry =>
                decimalHour >= entry.startHour &&
                decimalHour < entry.endHour
        );

    if (currentIndex === -1) {
        return undefined;
    }

    return schedule[currentIndex + 1];
}
