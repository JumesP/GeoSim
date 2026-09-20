import type { Person } from "../person/Person.js";
import type { World } from "../world/World.js";
import type { SequentialPlanEntry } from "../planning/generateSequentialPlan.js";
import { needsToTravel } from "./needsToTravel.js";

export function executePlanEntry(
    person: Person,
    world: World,
    entry: SequentialPlanEntry
): void {
    const destination =
        world.getLocation(entry.locationId);

    if (!destination) {
        return;
    }

    if (needsToTravel(person, world, entry)) {
        person.setDestination(destination.id);

        person.startMovement(
            destination.coordinate,
            new Date(),
            10
        );

        person.setStatus("travelling");

        return;
    }

    person.setDestination(null);

    switch (entry.activity) {
        case "working":
            person.setStatus("working");
            break;

        case "shopping":
            person.setStatus("shopping");
            break;

        case "exercising":
            person.setStatus("exercising");
            break;

        case "socialising":
            person.setStatus("socialising");
            break;

        case "at_home":
            person.setStatus("at_home");
            break;

        default:
            person.setStatus("at_home");
    }
}
