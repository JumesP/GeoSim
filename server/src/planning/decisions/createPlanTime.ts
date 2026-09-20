export function createPlanTime(
    date: Date,
    hour: number
): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setMinutes(hour * 60);

    return result;
}
