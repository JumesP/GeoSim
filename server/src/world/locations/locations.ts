import { createLocation } from "../generator.js";
import type { WorldLocation } from "../types.js";
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
            "Tesco Express Heelands",
            "shop",
            52.0507315,
            -0.7798389
        ),

        createLocation(
            LOCATION_IDS.coffeeShop,
            "E’DO Coffee",
            "restaurant",
            52.068644,
            -0.777874
        ),

        createLocation(
            LOCATION_IDS.restaurant,
            "The Victoria Inn",
            "restaurant",
            52.048564,
            -0.788697
        ),

        createLocation(
            LOCATION_IDS.park,
            "Park",
            "park",
            52.0564,
            -0.7662
        )
    ];
};
