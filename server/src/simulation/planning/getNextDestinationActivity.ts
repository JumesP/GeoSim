import type { Person } from "../../person/Person.js";
import type { World } from "../../world/World.js";
import type { SequentialPlanEntry } from "../../planning/SequentialPlan.js";
import { getPersonLocation } from "../../world/locations/getPersonLocation.js";
import { getCurrentSequentialPlanEntry } from "./getCurrentSequentialPlanEntry.js";

export function getNextDestinationActivity(
    person: Person,
    world: World,
    schedule: SequentialPlanEntry[],
    currentTime: Date
): {
    entry: SequentialPlanEntry;
    destinationId: string;
} | null {
    {
        const currentEntry =
            getCurrentSequentialPlanEntry(
                schedule,
                currentTime
            );

        if (!currentEntry) {
            return null;
        }

        const currentEntryIndex =
            schedule.indexOf(currentEntry);

        for (
            let i = currentEntryIndex + 1;
            i < schedule.length;
            i++
        ) {
            const entry = schedule[i];

            const destination = getPersonLocation(
                person,
                world.getLocations(),
                entry.location
            );

            if (!destination) {
                continue;
            }

            const isAlreadyThere =
                person.currentLocation.latitude ===
                destination.coordinate.latitude &&
                person.currentLocation.longitude ===
                destination.coordinate.longitude;

            if (!isAlreadyThere) {
                return {
                    entry,
                    destinationId: destination.id
                };
            }
        }

        return null;
    }
}
