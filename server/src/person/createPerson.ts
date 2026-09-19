import { Person } from "./Person.js";
import type { Coordinate } from "../world/types.js";
import type { ScheduleEntry } from "../world/schedule.js";

type CreatePersonOptions = {
    id: string;
    name: string;
    age: number;

    locations: Person["locations"];

    currentLocation: Coordinate;

    schedule: ScheduleEntry[];

    status?: Person["status"];

    destinationId?: string | null;

    travelMode?: Person["travelMode"];

    movementSpeed?: Person["movementSpeed"];

    profilePicture?: string;
};

export function createPerson({
    id,
    name,
    age,
    locations,
    currentLocation,
    schedule,
    status = "at_home",
    destinationId = null,
    travelMode = "walking",
    movementSpeed = {
        walking: 1.4,
        cycling: 5,
        driving: 13.9
    },
    profilePicture
}: CreatePersonOptions): Person {
    return new Person(
        id,
        name,
        age,
        locations,
        currentLocation,
        status,
        destinationId,
        schedule,
        null,
        travelMode,
        movementSpeed,
        profilePicture
    );
}
