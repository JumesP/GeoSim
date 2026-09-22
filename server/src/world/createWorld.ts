import { World } from "./World.js";
import { createWorldLocations } from "./locations/locations.js";
import { createWorldPeople } from "../person/people.js";

export function createWorld(): World {
    const world = new World();

    const locations = createWorldLocations();

    for (const location of locations) {
        console.log(`Adding location: ${location.name}`);
        world.addLocation(location);
    }

    createWorldPeople(world);

    return world;
};
