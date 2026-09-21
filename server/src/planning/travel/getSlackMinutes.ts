export function getSlackMinutes(
    currentTime: Date,
    commitmentStart: Date
): number {
    const milliseconds =
        commitmentStart.getTime() -
        currentTime.getTime();

    return Math.max(
        0,
        milliseconds / (60 * 1000)
    );
}
