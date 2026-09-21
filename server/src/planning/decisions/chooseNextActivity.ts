import type { Person } from "../../person/Person.js";
import type {
    ScheduleActivity,
    ScheduleLocation
} from "../../world/schedules/schedule.js";
import { chooseWeighted } from "../utilities/weightedChoice.js";
import type {
    ActivityPreferences,
    LocationPreferences
} from "../data/people/john.js";
import { getTransitionWeight } from "./getTransitionWeight.js";


export type ActivityOption = {
    activity: ScheduleActivity;
    location: ScheduleLocation;
    locationId: string;
    weight: number;
};

export function chooseNextActivity(
    person: Person,
    preferences: ActivityPreferences,
    locationPreferences: LocationPreferences,
    options: ActivityOption[],
    previousActivity: ScheduleActivity | null
): ActivityOption | null {
    if (options.length === 0) {
        return null;
    }

    const weightedOptions = options.map(option => {
        const locationPreference =
            locationPreferences[
                option.activity
            ]?.[option.locationId] ?? 1;

        const transitionWeight =
            getTransitionWeight(
                previousActivity,
                option.activity
            );

            return {
                value: option,
                weight:
                    (preferences[option.activity] ?? 1) *
                    option.weight *
                    locationPreference *
                    transitionWeight
            };
    });

    return chooseWeighted(weightedOptions);
}
