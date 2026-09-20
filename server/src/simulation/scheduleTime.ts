const SCHEDULE_TIME_ZONE = "Europe/London";

export function getScheduleDecimalHour(
    date: Date
): number {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: SCHEDULE_TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(date);

    const hour = Number(
        parts.find(part => part.type === "hour")?.value
    );

    const minute = Number(
        parts.find(part => part.type === "minute")?.value
    );

    return hour + minute / 60;
}
