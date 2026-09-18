import type { Coordinate, Person } from "../world/types.js";

export function startMovement(
    person: Person,
    destination: Coordinate,
    departureTime: Date,
    durationMinutes: number
): void {
    person.movement = {
        origin: { ...person.currentLocation },
        destination: { ...destination },
        departureTime: new Date(departureTime),
        arrivalTime: new Date(
            departureTime.getTime() +
            durationMinutes * 60 * 1000
        )
    };
}

export function updateMovement(
    person: Person,
    currentTime: Date
): void {
    if (!person.movement) {
        return;
    }

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

    person.currentLocation = {
        latitude:
            movement.origin.latitude +
            (movement.destination.latitude -
                movement.origin.latitude) * progress,

        longitude:
            movement.origin.longitude +
            (movement.destination.longitude -
                movement.origin.longitude) * progress
    };

    if (progress >= 1) {
        person.currentLocation = {
            ...movement.destination
        };

        person.movement = null;
    }
}
