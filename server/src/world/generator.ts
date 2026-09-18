import { randomUUID } from "crypto";

import type { Person, WorldLocation } from "./types.js";

export function createLocation(
    name: string,
    type: WorldLocation["type"],
    latitude: number,
    longitude: number
): WorldLocation {
    return {
        id: randomUUID(),
        name,
        type,
        coordinate: {
            latitude,
            longitude
        }
    };
}

export function createPerson(
    name: string,
    age: number,
    home: WorldLocation,
    workplace: WorldLocation
): Person {
    return {
        id: randomUUID(),
        name,
        age,

        homeId: home.id,
        workplaceId: workplace.id,

        currentLocation: home.coordinate,

        status: "at_home",

        destinationId: null,

        schedule: [],

        movement: null
    };
}
