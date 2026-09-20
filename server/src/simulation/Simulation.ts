import { World } from "../world/World.js";
import { getCurrentScheduleEntry } from "./getCurrentScheduleEntry.js";
import {
    updateMovement
} from "./movement.js";
import type { ScheduleActivity } from "../world/schedule.js";
import type { Person, PersonStatus } from "../person/Person.js";
import { decideTravel } from "./behaviour.js";
import { generateDailyPlan } from "../planning/generateDailyPlan.js";
import type { DailyPlan } from "../planning/DailyPlan.js";

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
            realDeltaSeconds * this.speed; // real life second = 1 second in simulation time * speed multiplier

        this.simulationTime = new Date(
            this.simulationTime.getTime() +
            simulationDeltaSeconds * 1000
        );

        for (const person of this.world.getPeople()) {
            const dailyPlan = this.getDailyPlan(person);

            const scheduleEntry = getCurrentScheduleEntry(
                dailyPlan.entries,
                this.simulationTime
            );

            if (!scheduleEntry) {
                continue;
            }

            if (!person.movement) {
                person.setStatus(
                    this.mapActivityToStatus(
                        scheduleEntry.activity
                    )
                );
            }

            const travelDecision = decideTravel(
                person,
                this.world,
                dailyPlan.entries,
                this.simulationTime
            );

            if (travelDecision) {
                console.log({
                    person: person.name,
                    time: this.simulationTime.toISOString(),
                    destinationId: travelDecision.destinationId,
                    travelTimeMinutes:
                        travelDecision.travelTimeMinutes,
                    departureTime:
                        travelDecision.departureTime.toISOString(),
                    movement: person.movement
                });
            }

            if (travelDecision) {
                const destination =
                    this.world.getRequiredLocation(
                        travelDecision.destinationId
                    );

                person.startMovement(
                    destination.coordinate,
                    this.simulationTime,
                    travelDecision.travelTimeMinutes
                );

                person.setDestination(destination.id);
                person.setStatus("travelling");
            }

            updateMovement(
                person,
                this.simulationTime
            );
        }
    }

    private mapActivityToStatus(
        activity: ScheduleActivity
    ): PersonStatus {
        switch (activity) {
            case "sleeping":
                return "sleeping";

            case "waking":
                return "waking";

            case "working":
                return "working";

            case "lunch":
                return "eating";

            case "shopping":
                return "shopping";

            case "exercising":
                return "exercising";

            case "socialising":
                return "socialising";

            case "travelling":
                return "travelling";

            case "at_home":
                return "at_home";
        }
    }

    private dailyPlans = new Map<
        string,
        DailyPlan
    >();

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

    private getDailyPlan(
        person: Person
    ): DailyPlan {
        const date = this.simulationTime;

        const dateString =
            new Intl.DateTimeFormat("en-CA", {
                timeZone: "Europe/London",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date);

        const existingPlan =
            this.dailyPlans.get(person.id);

        if (
            existingPlan &&
            existingPlan.date === dateString
        ) {
            return existingPlan;
        }

        const plan =
            generateDailyPlan(person, date);

        this.dailyPlans.set(
            person.id,
            plan
        );

        return plan;
    }
}
