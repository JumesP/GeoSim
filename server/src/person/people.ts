import type { World } from "../world/World.js";
import { createPersonFromDefinition } from "./generator.js";
import { john } from "../planning/data/people/john.js";
import { sarah } from "../planning/data/people/sarah.js";
import { matthew } from "../planning/data/people/matthew.js";

const people = [
    john,
    sarah,
    matthew
];

export function createWorldPeople(world: World): void {
    for (const definition of people) {
        const createdPerson =
            createPersonFromDefinition(
                world,
                definition
            );

        world.addGeneratedPerson(
            createdPerson.person,
            createdPerson.locations
        );
    }
}
