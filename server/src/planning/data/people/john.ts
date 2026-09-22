import type { PersonDefinition } from "./../PersonDefinition.js";
import { LOCATION_IDS } from "../../../world/locations/locationIds.js";

export const john: PersonDefinition = {
    id: "john",
    name: "John",
    age: 24,

    home: {
        id: "john-home",
        name: "John's Home",
        coordinate: {
            latitude: 52.0406,
            longitude: -0.7594
        }
    },

    locations: [
        {
            locationId: LOCATION_IDS.office,
            relationship: "work"
        },
        {
            locationId: LOCATION_IDS.coffeeShop,
            relationship: "favourite"
        },
        {
            locationId: LOCATION_IDS.tesco,
            relationship: "regular"
        },
        {
            locationId: LOCATION_IDS.restaurant,
            relationship: "favourite"
        },
        {
            locationId: LOCATION_IDS.park,
            relationship: "regular"
        }
    ],

    travelMode: "walking",
    movementSpeed: { // dont assign any to 0 not assign yet, need to stablize choice of movement speed based on item, this will be done when multiple inputs for travel objects are inputted
        walking: 1.4,
        cycling: 5,
        driving: 13.9
    },

    activityPreferences: {
        sleeping: 100,
        waking: 100,
        working: 80,
        at_home: 45,
        shopping: 20,
        socialising: 20,
        exercising: 10
    },

    locationPreferences: {
        shopping: {
            [LOCATION_IDS.tesco]: 80
        },

        socialising: {
            [LOCATION_IDS.coffeeShop]: 100,
            [LOCATION_IDS.restaurant]: 90
        },

        exercising: {
            [LOCATION_IDS.park]: 60
        }
    },

    commitments: [
        {
            activity: "working",
            locationId: "office",
            startHour: 9,
            endHour: 17,
            daysOfWeek: [1, 2, 3, 4, 5]
        }
    ],
};
