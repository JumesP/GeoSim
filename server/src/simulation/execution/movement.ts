import type { Person } from "../../person/Person.js";

export function updateMovement(
    person: Person,
    currentTime: Date
): void {
    if (!person.movement) return;

    const movement = person.movement;

    const totalDuration =
        movement.arrivalTime.getTime() -
        movement.departureTime.getTime();

    const elapsed =
        currentTime.getTime() -
        movement.departureTime.getTime();

    const progress = Math.min(
        Math.max(elapsed / totalDuration, 0),
        1
    );

    person.updateLocation({
        latitude:
            movement.origin.latitude +
            (movement.destination.latitude -
                movement.origin.latitude) * progress,

        longitude:
            movement.origin.longitude +
            (movement.destination.longitude -
                movement.origin.longitude) * progress
    });

    if (progress >= 1) {
        const destination = person.finishMovement();

        if (destination) {
            console.log(
                `${person.name} arrived at destination`
            );
        }
    }
}
