import type { Person } from "../../person/Person.js";
import type { World } from "../../world/World.js";
import type {
    ScheduleActivity,
    ScheduleLocation
} from "../../world/schedule.js";
import type { WorldLocation } from "../../world/types.js";
import type { ActivityOption } from "./chooseNextActivity.js";
import { locationRelationshipWeights } from "../data/locationWeights.js";
import { isActivityAllowedAtTime } from "./isActivityAllowedAtTime.js";
import { activityLocationTypes } from "../data/activityLocationTypes.js";

export function getAvailableActivities(
    person: Person,
    world: World,
    currentTime: Date,
    previousActivity: ScheduleActivity | null,
    canContinueSleep: boolean = false
): ActivityOption[] {
    const options: ActivityOption[] = [];

    const currentHour =
        currentTime.getHours() +
        currentTime.getMinutes() / 60;

    const home = person.getLocation("home");
    const work = person.getLocation("work");

    // Home
    if (home) {
        options.push({
            activity: "at_home",
            location: {
                relationship: "home"
            },
            locationId: home.locationId,
            weight: 100
        });

        if (
            currentHour >= 19 ||
            (
                canContinueSleep &&
                currentHour >= 6
            )
        ) {
            options.push({
                activity: "sleeping",
                location: {
                    relationship: "home"
                },
                locationId: home.locationId,
                weight: 100
            });
        }
    }

    // Work
    // if (
    //     work &&
    //     currentHour >= 8 &&
    //     currentHour < 18
    // ) {
    //     options.push({
    //         activity: "working",
    //         location: {
    //             relationship: "work"
    //         },
    //         locationId: work.locationId,
    //         weight: 100
    //     });
    // }

    // Other known locations
    for (const personLocation of person.locations) {
        if (
            personLocation.relationship !== "regular" &&
            personLocation.relationship !== "favourite"
        ) {
            continue;
        }

        const location =
            world.getLocation(
                personLocation.locationId
            );

        if (!location) {
            continue;
        }

        const activity =
            getActivityForLocationType(
                location.type
            );

        if (!activity) {
            continue;
        }

        if (
            !isActivityAllowedAtTime(
                activity,
                currentHour
            )
        ) {
            continue;
        }

        options.push({
            activity,
            location: {
                relationship:
                    personLocation.relationship,
                type: location.type
            },
            locationId: location.id,
            weight:
                locationRelationshipWeights[
                    personLocation.relationship
                ]
        });
    }

    return options;
}

function getActivityForLocationType(
    type: WorldLocation["type"]
): ScheduleActivity | null {
    for (const [activity, locationTypes] of Object.entries(
        activityLocationTypes
    )) {
        if (locationTypes.includes(type)) {
            return activity as ScheduleActivity;
        }
    }

    return null;
}
