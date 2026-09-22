import type { Person } from "../../person/Person.js";
import type { World } from "../../world/World.js";
import type { SequentialPlanEntry } from "../../planning/SequentialPlan.js";

export function needsToTravel(
    person: Person,
    world: World,
    entry: SequentialPlanEntry
): boolean {
    const destination = world.getLocation(
        entry.locationId
    );

    if (!destination) {
        return false;
    }

    const currentLocation =
        person.currentLocation;

    return (
        currentLocation.latitude !==
            destination.coordinate.latitude ||
        currentLocation.longitude !==
            destination.coordinate.longitude
    );
}
