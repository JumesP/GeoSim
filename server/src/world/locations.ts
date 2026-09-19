import { createLocation } from "./generator.js";
import type { WorldLocation } from "./types.js";
import { LOCATION_IDS } from "./locationIds.js";

export function createWorldLocations(): WorldLocation[] {
    return [
        createLocation(
            LOCATION_IDS.office,
            "Office",
            "work",
            52.0369,
            -0.7699
        ),

        createLocation(
            LOCATION_IDS.tesco,
            "Tesco",
            "shop",
            52.0400,
            -0.7580
        ),

        createLocation(
            LOCATION_IDS.coffeeShop,
            "Coffee Shop",
            "restaurant",
            52.0410,
            -0.7600
        ),

        createLocation(
            LOCATION_IDS.park,
            "Park",
            "park",
            52.0420,
            -0.7620
        )
    ];
}
