import { World } from "./World.js";
import { createLocation, createPerson } from "./generator.js";
import type { ScheduleEntry } from "./schedule.js";
import { johnSchedule } from "./schedules/john.js";

export function createWorld(): World {
    const world = new World();

    const home = createLocation(
        "John's Home",
        "home",
        52.0406,
        -0.7594
    );

    const workplace = createLocation(
        "John's Workplace",
        "work",
        52.0369,
        -0.7699
    );

    world.addLocation(home);
    world.addLocation(workplace);

    const john = createPerson(
        "John Smith",
        27,
        home,
        workplace,
    );

    john.schedule = johnSchedule;

    world.addPerson(john);

    return world;
}
