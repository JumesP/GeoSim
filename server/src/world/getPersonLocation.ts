import type { Person } from "../person/Person.js";
import type { WorldLocation } from "./types.js";
import type { ScheduleLocation } from "./schedule.js";

export function getPersonLocation(
    person: Person,
    locations: WorldLocation[],
    destination: ScheduleLocation
): WorldLocation | undefined {
    const personLocations = person.locations.filter(
        location =>
            location.relationship === destination.relationship
    );

    return locations.find(location =>
        personLocations.some(
            personLocation =>
                personLocation.locationId === location.id &&
                (
                    !("type" in destination) ||
                    location.type === destination.type
                )
        )
    );
}
