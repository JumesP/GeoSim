import type { World } from "../world/World.js";
import { createJohn } from "./generator.js";

export function createWorldPeople(world: World): void {
    const john = createJohn(world);

    world.addGeneratedPerson(
        john.person,
        john.locations
    );
}
