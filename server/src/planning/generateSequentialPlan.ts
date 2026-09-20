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
import type { PlanPriority } from "./planPriority.js";
import { getActivityPriority } from "./getActivityPriority.js";
import { getConcreteScheduleItems } from "./getConcreteScheduleItems.js";
import { johnCommitments } from "./data/people/john.js";
import { getAvailableFlexibleMinutes } from "./getAvailableFlexibleMinutes.js";
import { getLatestDepartureTime } from "./getLatestDepartureTime.js";
import { createTravelPlanEntry } from "./createTravelPlanEntry.js";
import { calculateTravelTime } from "../simulation/travel.js";
import { getSlackMinutes } from "./getSlackMinutes.js";
import { createWaitingPlanEntry } from "./createWaitingPlanEntry.js";

export type SequentialPlanEntry = {
    startTime: Date;
    endTime: Date;
    activity: ScheduleActivity | "travelling";
    location: ScheduleLocation;
    locationId: string;
    priority: PlanPriority;
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

    const concreteItems = getConcreteScheduleItems(
        johnCommitments,
        date
    );

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

    let concreteIndex = 0;

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
            locationId: home.locationId,
            priority: getActivityPriority("sleeping")
        });

        currentTime = minimumWakeTime;
    }

    while (currentTime < planEnd) {
        const nextConcreteItem =
            concreteItems[concreteIndex];

        const currentEntry =
            entries[entries.length - 1];

        const currentLocationId =
            currentEntry?.locationId ??
            home.locationId;

        if (
            nextConcreteItem &&
            currentTime >= nextConcreteItem.startTime
        ) {
            const currentLocation =
                world.getRequiredLocation(
                    currentLocationId
                );

            const destination =
                world.getRequiredLocation(
                    nextConcreteItem.locationId
                );

            if (
                currentLocation.id !==
                destination.id
            ) {
                const travelTimeMinutes =
                    calculateTravelTime(
                        person,
                        currentLocation.coordinate,
                        destination.coordinate
                    );

                const travelEnd = new Date(
                    currentTime.getTime() +
                    travelTimeMinutes * 60 * 1000
                );

                if (
                    travelEnd >
                    nextConcreteItem.startTime
                ) {
                    console.log(
                        "Scheduling conflict:",
                        {
                            from: currentLocation.id,
                            to: destination.id,
                            currentTime,
                            travelEnd,
                            commitmentStart:
                                nextConcreteItem.startTime
                        }
                    );

                    break;
                }

                entries.push(
                    createTravelPlanEntry(
                        currentTime,
                        travelEnd,
                        nextConcreteItem.locationId,
                        {
                            relationship: "work"
                        }
                    )
                );

                currentTime = travelEnd;

                continue;
            }

            entries.push({
                startTime: nextConcreteItem.startTime,
                endTime: nextConcreteItem.endTime,
                activity: nextConcreteItem.activity,
                location: {
                    relationship: "work"
                },
                locationId:
                    nextConcreteItem.locationId,
                priority: "fixed"
            });

            currentTime =
                nextConcreteItem.endTime;

            previousActivity =
                nextConcreteItem.activity;

            concreteIndex++;

            continue;
        }

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
                endTime: planEnd,
                activity: "at_home",
                location: {
                    relationship: "home"
                },
                locationId: home.locationId,
                priority: getActivityPriority("at_home")
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
            const currentLocation =
                world.getRequiredLocation(
                    activity.locationId
                );

            const nextConcreteItem =
                concreteItems[concreteIndex];

            const availableMinutes =
                getAvailableFlexibleMinutes(
                    person,
                    world,
                    currentTime,
                    currentLocation.coordinate,
                    nextConcreteItem
                );

            const duration =
                chooseActivityDuration(
                    activity.activity,
                    availableMinutes
                );

            if (!duration) {
                if (nextConcreteItem) {
                    const currentEntry =
                        entries[entries.length - 1];

                    const currentLocation =
                        world.getRequiredLocation(
                            currentEntry?.locationId ??
                            home.locationId
                        );

                    const destination =
                        world.getRequiredLocation(
                            nextConcreteItem.locationId
                        );

                    // We are already at the commitment location.
                    // Don't try to travel there again.
                    if (currentLocation.id === destination.id) {
                        const slackMinutes =
                            getSlackMinutes(
                                currentTime,
                                nextConcreteItem.startTime
                            );

                        console.log(
                            "Slack before commitment:",
                            {
                                location: currentLocation.id,
                                minutes: slackMinutes
                            }
                        );

                        entries.push(
                            createWaitingPlanEntry(
                                currentTime,
                                nextConcreteItem.startTime,
                                currentLocation.id,
                                {
                                    relationship: "work"
                                }
                            )
                        );

                        currentTime =
                            nextConcreteItem.startTime;

                        continue;
                    }

                    const travelTimeMinutes =
                        calculateTravelTime(
                            person,
                            currentLocation.coordinate,
                            destination.coordinate
                        );

                    const travelEnd = new Date(
                        currentTime.getTime() +
                        travelTimeMinutes * 60 * 1000
                    );

                    if (
                        travelEnd >
                        nextConcreteItem.startTime
                    ) {
                        console.log(
                            "Scheduling conflict:",
                            {
                                activity: activity.activity,
                                currentTime,
                                travelEnd,
                                commitmentStart:
                                    nextConcreteItem.startTime
                            }
                        );

                        break;
                    }

                    entries.push(
                        createTravelPlanEntry(
                            currentTime,
                            travelEnd,
                            nextConcreteItem.locationId,
                            {
                                relationship: "work"
                            }
                        )
                    );

                    currentTime = travelEnd;

                    continue;
                }

                console.log(
                    "No duration available:",
                    {
                        activity: activity.activity,
                        time: currentTime.toLocaleTimeString(
                            "en-GB"
                        )
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
            locationId: activity.locationId,
            priority: getActivityPriority(activity.activity)
        });

        currentTime = activityEnd;

        previousActivity =
            activity.activity;

        activityCounts[activity.activity] =
            (activityCounts[activity.activity] ?? 0) + 1;

        currentTime = activityEnd;
    }

    return {
        date,
        entries,
    };
}
