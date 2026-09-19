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
        profilePicture: "https://i.pravatar.cc/100?img=12",

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

        status: "at_home",

        destinationId: null,

        schedule: [],

        movement: null,

        travelMode: "cycling",

        movementSpeed: {
            walking: 1.4,
            cycling: 4.5,
            driving: 12
        }
    };
}
