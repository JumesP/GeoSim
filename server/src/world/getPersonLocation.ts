import type { Person, WorldLocation } from "./types.js";

export function getPersonLocation(
    person: Person,
    locations: WorldLocation[],
    relationship: "home" | "work"
): WorldLocation | undefined {
    const personLocation = person.locations.find(
        location =>
            location.relationship === relationship
    );

    if (!personLocation) {
        return undefined;
    }

    return locations.find(
        location =>
            location.id === personLocation.locationId
    );
}
