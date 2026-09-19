import type { Person } from "../person/Person.js";
import type { World } from "../world/World.js";
import type { ScheduleEntry } from "../world/schedule.js";
import { getPersonLocation } from "../world/getPersonLocation.js";

export function getNextDestinationActivity(
    person: Person,
    world: World,
    currentTime: Date
): {
    entry: ScheduleEntry;
    destinationId: string;
} | null {
    const currentEntryIndex = person.schedule.findIndex(
        entry => {
            const time = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Europe/London",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }).formatToParts(currentTime);

            const hour = Number(
                time.find(part => part.type === "hour")?.value
            );

            const minute = Number(
                time.find(part => part.type === "minute")?.value
            );

            const decimalHour = hour + minute / 60;

            return (
                decimalHour >= entry.startHour &&
                decimalHour < entry.endHour
            );
        }
    );

    if (currentEntryIndex === -1) {
        return null;
    }

    for (
        let i = currentEntryIndex + 1;
        i < person.schedule.length;
        i++
    ) {
        const entry = person.schedule[i];

        const destination = getPersonLocation(
            person,
            world.getLocations(),
            entry.location
        );

        if (!destination) {
            continue;
        }

        const isAlreadyThere =
            person.currentLocation.latitude ===
                destination.coordinate.latitude &&
            person.currentLocation.longitude ===
                destination.coordinate.longitude;

        if (!isAlreadyThere) {
            return {
                entry,
                destinationId: destination.id
            };
        }
    }

    return null;
}
