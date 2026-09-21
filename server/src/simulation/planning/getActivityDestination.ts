import type { Person } from "../../person/Person.js";
import type { World } from "../../world/World.js";
import type { SequentialPlanEntry } from "../../planning/generateSequentialPlan.js";
import type { WorldLocation } from "../../world/types.js";

export function getActivityDestination(
    person: Person,
    world: World,
    entry: SequentialPlanEntry
): WorldLocation | null {
    const location = world.getLocation(
        entry.locationId
    );

    if (!location) {
        return null;
    }

    return location;
}
