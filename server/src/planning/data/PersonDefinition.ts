import type { ScheduleActivity } from "../../world/schedules/schedule.js";
import type { PersonCommitment } from "../entries/PersonCommitment.js";
import type { Coordinate, LocationType } from "../../world/types.js";

export type ActivityPreferences =
    Partial<Record<ScheduleActivity, number>>;

export type LocationPreferences =
    Partial<
        Record<
            ScheduleActivity,
            Record<string, number>
        >
    >;

export type PersonDefinition = {
    id: string;
    name: string;
    age: number;

    home: {
        id: string;
        name: string;
        coordinate: Coordinate;
    };

    locations: {
        locationId: string;
        relationship:
            | "home"
            | "work"
            | "favourite"
            | "regular";
    }[];

    travelMode: "walking" | "cycling" | "driving";

    movementSpeed: {
        walking: number;
        cycling?: number;
        driving?: number;
    };

    activityPreferences: ActivityPreferences;
    locationPreferences: LocationPreferences;
    commitments: PersonCommitment[];
};
