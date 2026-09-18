import { World } from "../world/World.js";
import { getCurrentScheduleEntry } from "./getCurrentScheduleEntry.js";
import {
    startMovement,
    updateMovement
} from "./movement.js";
import { calculateTravelTime } from "./travel.js";

export type SimulationSpeed = 0 | 0.1 | 0.5 | 1 | 2 | 5 | 10 | 60;

export class Simulation {
    private simulationTime: Date;
    private speed: SimulationSpeed = 1;

    constructor(
        private readonly world: World,
        startTime: Date = new Date()
    ) {
        this.simulationTime = new Date(startTime);
    }

    update(realDeltaSeconds: number): void {
        const simulationDeltaSeconds =
            realDeltaSeconds * 60 * this.speed;

        this.simulationTime = new Date(
            this.simulationTime.getTime() +
            simulationDeltaSeconds * 1000
        );

        for (const person of this.world.getPeople()) {
            const scheduleEntry = getCurrentScheduleEntry(
                person.schedule,
                this.simulationTime
            );

            if (!scheduleEntry) {
                continue;
            }

            person.status = this.mapActivityToStatus(
                scheduleEntry.activity
            );

            if (
                scheduleEntry.activity === "travelling" &&
                !person.movement
            ) {
                const destination =
                    scheduleEntry.locationType === "work"
                        ? this.world.getLocation(person.workplaceId)
                        : this.world.getLocation(person.homeId);

                if (destination) {
                    const travelTime = calculateTravelTime(
                        person.currentLocation,
                        destination.coordinate
                    );

                    startMovement(
                        person,
                        destination.coordinate,
                        this.simulationTime,
                        travelTime
                    );

                    person.destinationId = destination.id;
                }
            }

            updateMovement(
                person,
                this.simulationTime
            );
        }
    }

    private mapActivityToStatus(
        activity: string
    ) {
        switch (activity) {
            case "sleeping":
                return "sleeping";

            case "waking":
                return "waking";

            case "working":
                return "working";

            case "lunch":
                return "eating";

            case "travelling":
                return "travelling";

            case "at_home":
                return "at_home";

            default:
                return "at_home";
        }
    }

    getTime(): Date {
        return new Date(this.simulationTime);
    }

    getSpeed(): SimulationSpeed {
        return this.speed;
    }

    setSpeed(speed: SimulationSpeed): void {
        this.speed = speed;
    }

    getWorld(): World {
        return this.world;
    }
}
