import { randomUUID } from "crypto";

import type { WorldLocation } from "./types.js";

export function createLocation(
    id: string,
    name: string,
    type: WorldLocation["type"],
    latitude: number,
    longitude: number
): WorldLocation {
    return {
        id,
        name,
        type,
        coordinate: {
            latitude,
            longitude
        }
    };
}
