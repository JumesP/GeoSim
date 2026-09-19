import type { Coordinate } from "../world/types.js";
import type { Person } from "../person/Person.js";

const averageWalkingSpeed = 1.4;
const averageCyclingSpeed = 4.1;

function calculateDistance(
    a: Coordinate,
    b: Coordinate
): number {
    const earthRadius = 6_371_000;

    const latitude1 = a.latitude * Math.PI / 180;
    const latitude2 = b.latitude * Math.PI / 180;

    const latitudeDifference =
        (b.latitude - a.latitude) * Math.PI / 180;

    const longitudeDifference =
        (b.longitude - a.longitude) * Math.PI / 180;

    const haversine =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(longitudeDifference / 2) ** 2;

    const angularDistance =
        2 * Math.atan2(
            Math.sqrt(haversine),
            Math.sqrt(1 - haversine)
        );

    return earthRadius * angularDistance;
}

export function calculateTravelTime(
    person: Person,
    origin: Coordinate,
    destination: Coordinate
): number {
    const distance = calculateDistance(
        origin,
        destination
    );

    const speed =
        person.movementSpeed[person.travelMode];

    const travelTimeSeconds =
        distance / speed;

    return travelTimeSeconds / 60;
}
