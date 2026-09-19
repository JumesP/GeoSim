import { createPerson } from "./createPerson.js";
import { createLocation } from "../world/generator.js";
import { johnSchedule } from "../world/schedules/john.js";
import { LOCATION_IDS } from "../world/locationIds.js";
import type { World } from "../world/World.js";
import type { WorldLocation } from "../world/types.js";

export function createJohn(
    world: World
): {
    person: ReturnType<typeof createPerson>;
    locations: WorldLocation[];
} {
    const workplace = world.getRequiredLocation(
        LOCATION_IDS.office
    );

    const coffeeShop = world.getRequiredLocation(
        LOCATION_IDS.coffeeShop
    );

    const tesco = world.getRequiredLocation(
        LOCATION_IDS.tesco
    );

    const home = createLocation(
        "john-home",
        "John's Home",
        "home",
        52.0406,
        -0.7594
    );

    const person = createPerson({
        id: "john",
        name: "John",
        age: 24,

        locations: [
            {
                locationId: home.id,
                relationship: "home"
            },
            {
                locationId: workplace.id,
                relationship: "work"
            }
        ],

        currentLocation: home.coordinate,

        schedule: johnSchedule
    });

    return {
        person,
        locations: [home, workplace, coffeeShop, tesco]
    };
}
