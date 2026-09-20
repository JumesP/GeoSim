import type { Person } from "../person/Person.js";
import type { World } from "../world/World.js";
import type { ConcreteScheduleItem } from "./ConcreteScheduleItem.js";
import type { Coordinate } from "../world/types.js";
import { calculateTravelTime } from "../simulation/travel.js";

export function getLatestDepartureTime(
    person: Person,
    world: World,
    origin: Coordinate,
    concreteItem: ConcreteScheduleItem
): Date | null {
    const destination =
        world.getLocation(
            concreteItem.locationId
        );

    if (!destination) {
        return null;
    }

    const travelTimeMinutes =
        calculateTravelTime(
            person,
            origin,
            destination.coordinate
        );

    return new Date(
        concreteItem.startTime.getTime() -
        travelTimeMinutes * 60 * 1000
    );
}
