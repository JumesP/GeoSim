import type { Person } from "../person/Person.js";
import type { World } from "../world/World.js";
import type {
    ScheduleActivity,
    ScheduleLocation
} from "../world/schedule.js";

import { chooseNextActivity } from "./decisions/chooseNextActivity.js";
import { chooseActivityDuration } from "./decisions/chooseActivityDuration.js";
import { getAvailableActivities } from "./decisions/getAvailableActivities.js";
import {
    johnActivityPreferences,
    johnLocationPreferences
} from "./data/people/john.js";
import { createPlanTime } from "./decisions/createPlanTime.js";
import { activityLimits } from "./data/activityLimits.js";

export type SequentialPlanEntry = {
    startTime: Date;
    endTime: Date;
    activity: ScheduleActivity;
    location: ScheduleLocation;
    locationId: string;
};

export type SequentialPlan = {
    date: Date;
    entries: SequentialPlanEntry[];
};

export function generateSequentialPlan(
    person: Person,
    world: World,
    date: Date,
    previousDayActivity: ScheduleActivity | null = null
): SequentialPlan {
    const entries: SequentialPlanEntry[] = [];

    const activityCounts : Partial<Record<ScheduleActivity, number>> = {};

    const home =
        person.getLocation("home");

    if (!home) {
        return {
            date,
            entries
        };
    }

    let currentTime = createPlanTime(date, 0);

    let previousActivity: ScheduleActivity | null = previousDayActivity;
    let canContinueSleep = previousActivity === "sleeping";

    console.log(
        "PLAN START:",
        createPlanTime(date, 0).toString()
    );

    console.log(
        "PLAN END:",
        createPlanTime(date, 24).toString()
    );

    const planEnd = createPlanTime(date, 24);

    if (previousActivity === "sleeping") {
        const minimumWakeTime =
            createPlanTime(date, 6);

        entries.push({
            startTime: currentTime,
            endTime: minimumWakeTime,
            activity: "sleeping",
            location: {
                relationship: "home"
            },
            locationId: home.locationId
        });

        currentTime = minimumWakeTime;
    }

    while (currentTime < createPlanTime(date, 24)) {
        console.log(
            "LOOP:",
            currentTime.toString(),
            "<",
            createPlanTime(date, 24).toString(),
            "=",
            currentTime < createPlanTime(date, 24)
        );
        const availableActivities =
            getAvailableActivities(
                person,
                world,
                currentTime,
                previousActivity,
                canContinueSleep
            );

        const activitiesWithinLimit =
            availableActivities.filter(option => {
                const limit =
                    activityLimits[option.activity];

                if (!limit) {
                    return true;
                }

                const count =
                    activityCounts[option.activity] ?? 0;

                return count < limit.max;
            });

        console.log(
            "AVAILABLE:",
            currentTime.toLocaleTimeString("en-GB"),
            availableActivities.map(option => ({
                activity: option.activity,
                locationId: option.locationId,
                weight: option.weight
            }))
        );

        const activity = chooseNextActivity(
            person,
            johnActivityPreferences,
            johnLocationPreferences,
            activitiesWithinLimit,
            previousActivity
        );

        if (canContinueSleep) {
            canContinueSleep = false;
        }

        console.log(
            "CHOSEN:",
            currentTime.toLocaleTimeString("en-GB"),
            activity?.activity,
            activity?.locationId
        );

        if (!activity) {
            console.log(
                "No activity available:",
                {
                    time: currentTime.toLocaleTimeString("en-GB"),
                    previousActivity,
                    availableActivities
                }
            );

            entries.push({
                startTime: currentTime,
                endTime: createPlanTime(date, 24),
                activity: "at_home",
                location: {
                    relationship: "home"
                },
                locationId: home.locationId
            });

            break;
        }

        let activityEnd: Date;

        if (activity.activity === "sleeping") {
            const duration =
                chooseActivityDuration("sleeping");

            if (!duration) {
                break;
            }

            activityEnd =
                new Date(
                    currentTime.getTime() +
                    duration * 60 * 1000
                );

            if (activityEnd > planEnd) {
                activityEnd.setTime(
                    planEnd.getTime()
                );
            }

            if (activityEnd <= currentTime) {
                break;
            }
        } else {
            const duration =
                chooseActivityDuration(
                    activity.activity
                );

            if (!duration) {
                    console.log(
                        "No duration available:",
                        {
                            activity: activity.activity,
                            time: currentTime.toLocaleTimeString("en-GB")
                        }
                    );

                break;
            }

            activityEnd =
                new Date(
                    currentTime.getTime() +
                    duration * 60 * 1000
                );

            if (activityEnd > planEnd) {
                activityEnd.setTime(
                    planEnd.getTime()
                );
            }

            if (activityEnd <= currentTime) {
                break;
            }
        }

        entries.push({
            startTime: currentTime,
            endTime: activityEnd,
            activity: activity.activity,
            location: activity.location,
            locationId: activity.locationId
        });

        previousActivity = activity.activity;

        activityCounts[activity.activity] =
            (activityCounts[activity.activity] ?? 0) + 1;

        currentTime = activityEnd;
    }

    return {
        date,
        entries,
    };
}
