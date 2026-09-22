import type { ScheduleActivity } from "../world/schedules/schedule.js";
import type { Person } from "../person/Person.js";
import { World } from "../world/World.js";
import { updateMovement } from "./execution/movement.js";
import { decideTravel } from "./execution/behaviour.js";
import { generateSequentialPlan } from "../planning/generateSequentialPlan.js";
import { SequentialPlan } from "../planning/SequentialPlan.js";
import { getCurrentSequentialPlanEntry } from "./planning/getCurrentSequentialPlanEntry.js";

export type SimulationSpeed = 0 | 0.1 | 0.5 | 1 | 2 | 5 | 10 | 60;

export class Simulation {
    private simulationTime: Date;
    private speed: SimulationSpeed = 60; // 1 = 1 second

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

            const sequentialPlan =
                this.getSequentialPlan(person);

            const currentEntry =
                getCurrentSequentialPlanEntry(
                    sequentialPlan.entries,
                    this.simulationTime
                );

            if (!currentEntry) {
                continue;
            }

            if (!person.movement) {
                person.setStatus(
                    this.mapActivityToStatus(
                        currentEntry.activity
                    )
                );
            }

            const travelDecision = decideTravel(
                person,
                this.world,
                sequentialPlan.entries,
                this.simulationTime
            );

            if (travelDecision) {
                console.log({
                    person: person.name,
                    time: this.simulationTime.toISOString(),
                    destinationId:
                        travelDecision.destinationId,
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

                person.setDestination(
                    destination.id
                );

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
    ): ScheduleActivity {
        switch (activity) {
            case "sleeping":
                return "sleeping";

            case "waking":
                return "waking";

            case "working":
                return "working";

            case "lunch":
                return "lunch";

            case "shopping":
                return "shopping";

            case "exercising":
                return "exercising";

            case "socialising":
                return "socialising";

            case "waiting":
                return "waiting";

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

    private getSequentialPlan(person: Person): SequentialPlan {
        const date = this.simulationTime
            .toISOString()
            .slice(0, 10);

        if (
            person.plan &&
            person.plan.date.toISOString().slice(0, 10) === date
        ) {
            return person.plan;
        }

        const previousDayActivity =
            person.plan?.entries.at(-1)?.activity ?? null;

        person.plan = generateSequentialPlan({
            person,
            definition: person.definition,
            world: this.world,
            date: this.simulationTime,
            previousDayActivity
        });

        return person.plan;
    }
}
