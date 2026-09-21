import type { PersonCommitment } from "./entries/PersonCommitment.js";
import type { ConcreteScheduleItem } from "./entries/ConcreteScheduleItem.js";

export function getConcreteScheduleItems(
    commitments: PersonCommitment[],
    date: Date
): ConcreteScheduleItem[] {
    const dayOfWeek = date.getDay();

    return commitments
        .filter(commitment =>
            commitment.daysOfWeek.includes(dayOfWeek)
        )
        .map(commitment => {
            const startTime = new Date(date);
            startTime.setHours(
                commitment.startHour,
                0,
                0,
                0
            );

            const endTime = new Date(date);
            endTime.setHours(
                commitment.endHour,
                0,
                0,
                0
            );

            return {
                activity: commitment.activity,
                locationId: commitment.locationId,
                startTime,
                endTime
            };
        })
        .sort(
            (a, b) =>
                a.startTime.getTime() -
                b.startTime.getTime()
        );
}
