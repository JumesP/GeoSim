import type { Coordinate } from "../world/types.js";
import type { ScheduleEntry } from "../world/schedules/schedule.js";
import type { ScheduleActivity, ScheduleLocation } from "../world/schedules/schedule.js";

export type PersonLocation = {
    locationId: string;
    relationship:
        | "home"
        | "work"
        | "favourite"
        | "regular";
};

export type TravelMode =
    | "walking"
    | "cycling"
    | "driving";

export type PersonMovement = {
    origin: Coordinate;
    destination: Coordinate;
    departureTime: Date;
    arrivalTime: Date;
};

export class Person {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly age: number,

        public readonly locations: PersonLocation[],

        public currentLocation: Coordinate,

        public status: ScheduleActivity,

        public destinationId: string | null,

        public schedule: ScheduleEntry[],

        public movement: PersonMovement | null,

        public travelMode: TravelMode,

        public movementSpeed: {
            walking: number;
            cycling: number;
            driving: number;
        },

        public readonly profilePicture?: string
    ) { }

    setStatus(status: ScheduleActivity): void {
        this.status = status;
    }

    setDestination(destinationId: string | null): void {
        this.destinationId = destinationId;
    }

    setMovement(movement: PersonMovement | null): void {
        this.movement = movement;
    }

    startMovement(
        destination: Coordinate,
        departureTime: Date,
        durationMinutes: number
    ): void {
        this.movement = {
            origin: { ...this.currentLocation },
            destination: { ...destination },
            departureTime: new Date(departureTime),
            arrivalTime: new Date(
                departureTime.getTime() +
                durationMinutes * 60 * 1000
            )
        };
    }

    updateLocation(location: Coordinate): void {
        this.currentLocation = {
            ...location
        };
    }

    finishMovement(): Coordinate | null {
        if (!this.movement) {
            return null;
        }

        const destination = {
            ...this.movement.destination
        };

        this.currentLocation = destination;

        this.movement = null;
        this.destinationId = null;

        return destination;
    }

    getLocation(
        relationship: PersonLocation["relationship"]
    ): PersonLocation | undefined {
        return this.locations.find(
            location =>
                location.relationship === relationship
        );
    }
}
