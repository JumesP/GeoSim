import type { Coordinate } from "../world/types.js";

function calculateDistance(
    a: Coordinate,
    b: Coordinate
): number {
    const latitudeDifference = b.latitude - a.latitude;
    const longitudeDifference = b.longitude - a.longitude;

    return Math.sqrt(
        latitudeDifference ** 2 +
        longitudeDifference ** 2
    );
}

export function calculateTravelTime(
    origin: Coordinate,
    destination: Coordinate
): number {
    const distance = calculateDistance(
        origin,
        destination
    );

    // Temporary approximation.
    // We'll replace this with actual routing later.
    const speed = 0.01;

    return Math.max(
        5,
        distance / speed
    );
}
