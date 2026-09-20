import type { Person } from "../person/Person.js";
import type { World } from "../world/World.js";
import type { Coordinate } from "../world/types.js";
import type { ConcreteScheduleItem } from "./ConcreteScheduleItem.js";
import { getLatestDepartureTime } from "./getLatestDepartureTime.js";

export function getAvailableFlexibleMinutes(
    person: Person,
    world: World,
    currentTime: Date,
    origin: Coordinate,
    nextConcreteItem: ConcreteScheduleItem | undefined
): number {
    if (!nextConcreteItem) {
        return Infinity;
    }

    const latestDeparture =
        getLatestDepartureTime(
            person,
            world,
            origin,
            nextConcreteItem
        );

    if (!latestDeparture) {
        return 0;
    }

    const milliseconds =
        latestDeparture.getTime() -
        currentTime.getTime();

    return Math.max(
        0,
        milliseconds / (60 * 1000)
    );
}
