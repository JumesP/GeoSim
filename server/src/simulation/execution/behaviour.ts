import type { Person } from "../../person/Person.js";
import type { World } from "../../world/World.js";
import { getNextDestinationActivity } from "./../planning/getNextDestinationActivity.js";
import { getDepartureTime } from "./../schedule/getDepartureTime.js";
import { calculateTravelTime } from "./travel.js";
import type { SequentialPlanEntry } from "../../planning/SequentialPlan.js";

export function decideTravel(
    person: Person,
    world: World,
    schedule: SequentialPlanEntry[],
    currentTime: Date
): {
    destinationId: string;
    travelTimeMinutes: number;
    departureTime: Date;
} | null {
    if (person.movement) {
        return null;
    }

    const nextDestination = getNextDestinationActivity(
        person,
        world,
        schedule,
        currentTime
    );

    if (!nextDestination) {
        return null;
    }

    const destination = world.getRequiredLocation(
        nextDestination.destinationId
    );

    if (
        person.currentLocation.latitude ===
            destination.coordinate.latitude &&
        person.currentLocation.longitude ===
            destination.coordinate.longitude
    ) {
        return null;
    }

    const travelTimeMinutes = calculateTravelTime(
        person,
        person.currentLocation,
        destination.coordinate
    );

    const departureTime = getDepartureTime(
        nextDestination.entry,
        currentTime,
        travelTimeMinutes
    );

    if (currentTime < departureTime) {
        return null;
    }

    return {
        destinationId: destination.id,
        travelTimeMinutes,
        departureTime
    };
};
