import { World } from "./World.js";
import { createWorldLocations } from "./locations.js";
import { createWorldPeople } from "../person/people.js";

export function createWorld(): World {
    const world = new World();

    const locations = createWorldLocations();

    for (const location of locations) {
        world.addLocation(location);
    }

    createWorldPeople(world);

    return world;
};
