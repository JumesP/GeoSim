import { createPerson } from "./createPerson.js";
import { createLocation } from "../world/generator.js";
import type { World } from "../world/World.js";
import type { WorldLocation } from "../world/types.js";
import type { PersonDefinition } from "../planning/data/PersonDefinition.js";

export function createPersonFromDefinition(
    world: World,
    definition: PersonDefinition
): {
    person: ReturnType<typeof createPerson>;
    locations: WorldLocation[];
} {
    const home = createLocation(
        definition.home.id,
        definition.home.name,
        "home",
        definition.home.coordinate.latitude,
        definition.home.coordinate.longitude
    );

    const personLocations = [
        {
            locationId: home.id,
            relationship: "home" as const
        },
        ...definition.locations
    ];

    const person = createPerson({
        id: definition.id,
        name: definition.name,
        age: definition.age,
        locations: personLocations,
        currentLocation: home.coordinate,
        definition
    });

    return {
        person,
        locations: [home]
    };
}
