import type { Person } from "../person/Person.js";
import type { World } from "../world/World.js";
import type {
    ScheduleActivity,
    ScheduleLocation
} from "../world/schedules/schedule.js";

import { chooseNextActivity } from "./decisions/chooseNextActivity.js";
import { chooseActivityDuration } from "./decisions/chooseActivityDuration.js";
import { getAvailableActivities } from "./decisions/getAvailableActivities.js";
import {
    johnActivityPreferences,
    johnLocationPreferences,
    johnCommitments
} from "./data/people/john.js";
import { createPlanTime } from "./decisions/createPlanTime.js";
import { activityLimits } from "./data/activities/activityLimits.js";
import type { PlanPriority } from "./mechanics/planPriority.js";
import { getActivityPriority } from "./mechanics/activities/getActivityPriority.js";
import { getConcreteScheduleItems } from "./getConcreteScheduleItems.js";
import { getAvailableFlexibleMinutes } from "./travel/getAvailableFlexibleMinutes.js";
import { createTravelPlanEntry } from "./travel/createTravelPlanEntry.js";
import { calculateTravelTime } from "../simulation/execution/travel.js";
import { getSlackMinutes } from "./travel/getSlackMinutes.js";
import { createWaitingPlanEntry } from "./entries/createWaitingPlanEntry.js";
import { IdleActivity } from "./idle/IdleActivity.js";
import { chooseIdleActivity } from "./idle/chooseIdleActivity.js";
import { cutPlanEntry } from "./mechanics/cutPlanEntry.js";
import { getMinimumActivityDuration } from "./mechanics/activities/getMinimumActivityDuration.js";
import { comparePlanPriority } from "./mechanics/comparePlanPriority.js";

export type SequentialPlanEntry = {
    startTime: Date;
    endTime: Date;
    activity: ScheduleActivity | "travelling";
    idleActivity?: IdleActivity;
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

    const activityCounts: Partial<Record<ScheduleActivity, number>> = {};

    const home =
        person.getLocation("home");

    if (!home) {
        return {
            date,
            entries
        };
    }

    const concreteItems =
        getConcreteScheduleItems(
            johnCommitments,
            date
        );

    let currentTime =
        createPlanTime(date, 0);

    let previousActivity:
        ScheduleActivity | null =
        previousDayActivity;

    let canContinueSleep =
        previousActivity === "sleeping";

    const planEnd =
        createPlanTime(date, 24);

    let concreteIndex = 0;

    console.log(
        "PLAN START:",
        currentTime.toString()
    );

    console.log(
        "PLAN END:",
        planEnd.toString()
    );

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

        /*
         * Handle fixed commitments.
         */
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

        /*
         * Find activities that are currently available.
         */
        const availableActivities =
            getAvailableActivities(
                person,
                world,
                currentTime,
                previousActivity,
                canContinueSleep
            );

        const activitiesWithinLimit =
            availableActivities.filter(
                option => {
                    const limit =
                        activityLimits[
                        option.activity
                        ];

                    if (!limit) {
                        return true;
                    }

                    const count =
                        activityCounts[
                        option.activity
                        ] ?? 0;

                    return (
                        count < limit.max
                    );
                }
            );

        /*
         * Activities that fail during this
         * planning attempt are rejected so
         * that we can try another option.
         */
        const rejectedActivities = new Set<string>();

        const getRemainingActivities = () =>
            activitiesWithinLimit.filter(
                option =>
                    !rejectedActivities.has(
                        `${option.activity}:${option.locationId}`
                    )
            );

        let activity = chooseNextActivity(
            person,
            johnActivityPreferences,
            johnLocationPreferences,
            getRemainingActivities(),
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

        let activityEnd:
            Date | null = null;

        /*
         * Used when the current time has reached
         * the commitment location and we simply
         * need to fill the remaining slack.
         */
        let waitingForCommitment =
            false;

        /*
         * Keep trying activities until one can
         * actually be scheduled.
         */
        while (
            activity &&
            !activityEnd &&
            !waitingForCommitment
        ) {
            const activityKey =
                `${activity.activity}:${activity.locationId}`;

            /*
             * Sleeping is special because it always
             * happens at home and must fit before the
             * next commitment.
             */
            if (activity.activity === "sleeping") {
                const homeLocation =
                    world.getRequiredLocation(
                        home.locationId
                    );

                const currentEntry =
                    entries[
                    entries.length - 1
                    ];

                const currentLocation =
                    world.getRequiredLocation(
                        currentEntry?.locationId ??
                        home.locationId
                    );

                /*
                * If we aren't at home, we need to travel
                * home before we can start sleeping.
                */
                if (
                    currentLocation.id !==
                    homeLocation.id
                ) {
                    const travelTimeMinutes =
                        calculateTravelTime(
                            person,
                            currentLocation.coordinate,
                            homeLocation.coordinate
                        );

                    const travelEnd =
                        new Date(
                            currentTime.getTime() +
                            travelTimeMinutes *
                            60 *
                            1000
                        );

                    /*
                    * We need to be able to get home
                    * before the end of the plan.
                    */
                    if (
                        travelEnd >=
                        planEnd
                    ) {
                        rejectedActivities.add(
                            activityKey
                        );

                        activity =
                            chooseNextActivity(
                                person,
                                johnActivityPreferences,
                                johnLocationPreferences,
                                activitiesWithinLimit.filter(
                                    option =>
                                        !rejectedActivities.has(
                                            `${option.activity}:${option.locationId}`
                                        )
                                ),
                                previousActivity
                            );

                        continue;
                    }

                    entries.push(
                        createTravelPlanEntry(
                            currentTime,
                            travelEnd,
                            home.locationId,
                            {
                                relationship: "home"
                            }
                        )
                    );

                    currentTime =
                        travelEnd;
                }

                /*
                * Now we are at home, so calculate how much
                * time is available for sleeping.
                */
                const availableMinutes =
                    getAvailableFlexibleMinutes(
                        person,
                        world,
                        currentTime,
                        homeLocation.coordinate,
                        concreteItems[
                        concreteIndex
                        ]
                    );

                const duration =
                    chooseActivityDuration(
                        "sleeping",
                        availableMinutes
                    );

                if (!duration) {
                    rejectedActivities.add(
                        activityKey
                    );

                    activity =
                        chooseNextActivity(
                            person,
                            johnActivityPreferences,
                            johnLocationPreferences,
                            activitiesWithinLimit.filter(
                                option =>
                                    !rejectedActivities.has(
                                        `${option.activity}:${option.locationId}`
                                    )
                            ),
                            previousActivity
                        );

                    continue;
                }

                activityEnd =
                    new Date(
                        currentTime.getTime() +
                        duration *
                        60 *
                        1000
                    );

                if (
                    activityEnd >
                    planEnd
                ) {
                    activityEnd =
                        new Date(planEnd);
                }

                if (
                    activityEnd <=
                    currentTime
                ) {
                    activityEnd = null;

                    rejectedActivities.add(
                        activityKey
                    );

                    activity =
                        chooseNextActivity(
                            person,
                            johnActivityPreferences,
                            johnLocationPreferences,
                            activitiesWithinLimit.filter(
                                option =>
                                    !rejectedActivities.has(
                                        `${option.activity}:${option.locationId}`
                                    )
                            ),
                            previousActivity
                        );

                    continue;
                }
            } else {
                const currentEntry =
                    entries[
                    entries.length - 1
                    ];

                const currentLocation =
                    world.getRequiredLocation(
                        currentEntry?.locationId ??
                        home.locationId
                    );

                const activityLocation =
                    world.getRequiredLocation(
                        activity.locationId
                    );

                const nextConcreteItem =
                    concreteItems[
                    concreteIndex
                    ];

                const travelTimeMinutes =
                    currentLocation.id ===
                        activityLocation.id
                        ? 0
                        : calculateTravelTime(
                            person,
                            currentLocation.coordinate,
                            activityLocation.coordinate
                        );

                const availableMinutes =
                    getAvailableFlexibleMinutes(
                        person,
                        world,
                        currentTime,
                        activityLocation.coordinate,
                        nextConcreteItem
                    );

                const duration =
                    chooseActivityDuration(
                        activity.activity,
                        availableMinutes
                    );

                /*
                 * The activity cannot fit.
                 */
                if (!duration) {
                    if (
                        nextConcreteItem
                    ) {
                        const destination =
                            world.getRequiredLocation(
                                nextConcreteItem.locationId
                            );

                        /*
                         * We are already where the
                         * commitment happens.
                         *
                         * Fill the remaining time
                         * with waiting rather than
                         * trying another activity.
                         */
                        if (
                            currentLocation.id ===
                            destination.id
                        ) {
                            const slackMinutes =
                                getSlackMinutes(
                                    currentTime,
                                    nextConcreteItem.startTime
                                );

                            console.log(
                                "Slack before commitment:",
                                {
                                    location:
                                        currentLocation.id,
                                    minutes:
                                        slackMinutes
                                }
                            );

                            if (
                                slackMinutes > 0
                            ) {
                                const previousIdleActivity =
                                    entries[
                                        entries.length - 1
                                    ]?.idleActivity;

                                const idleActivity =
                                    chooseIdleActivity(
                                        previousIdleActivity
                                    );

                                const waitingEntry =
                                    createWaitingPlanEntry(
                                        currentTime,
                                        nextConcreteItem.startTime,
                                        currentLocation.id,
                                        {
                                            relationship:
                                                "work"
                                        }
                                    );

                                waitingEntry.idleActivity =
                                    idleActivity;

                                entries.push(
                                    waitingEntry
                                );
                            }

                            currentTime =
                                nextConcreteItem.startTime;

                            waitingForCommitment =
                                true;

                            continue;
                        }

                        /*
                         * We need to get to the next
                         * fixed commitment.
                         */
                        const commitmentTravelTime =
                            calculateTravelTime(
                                person,
                                currentLocation.coordinate,
                                destination.coordinate
                            );

                        const travelEnd =
                            new Date(
                                currentTime.getTime() +
                                commitmentTravelTime *
                                60 *
                                1000
                            );

                        if (
                            travelEnd >
                            nextConcreteItem.startTime
                        ) {
                            console.log(
                                "Scheduling conflict:",
                                {
                                    activity:
                                        activity.activity,
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
                                    relationship:
                                        "work"
                                }
                            )
                        );

                        currentTime =
                            travelEnd;

                        continue;
                    }

                    /*
                     * No commitment exists, so reject
                     * this activity and try another.
                     */
                    console.log(
                        "Rejecting activity: no duration available",
                        {
                            activity:
                                activity.activity,
                            time:
                                currentTime.toLocaleTimeString(
                                    "en-GB"
                                )
                        }
                    );

                    rejectedActivities.add(
                        activityKey
                    );

                    activity =
                        chooseNextActivity(
                            person,
                            johnActivityPreferences,
                            johnLocationPreferences,
                            activitiesWithinLimit.filter(
                                option =>
                                    !rejectedActivities.has(
                                        `${option.activity}:${option.locationId}`
                                    )
                            ),
                            previousActivity
                        );

                    continue;
                }

                activityEnd =
                    new Date(
                        currentTime.getTime() +
                        duration *
                        60 *
                        1000
                    );

                if (
                    activityEnd >
                    planEnd
                ) {
                    activityEnd =
                        new Date(planEnd);
                }

                if (
                    activityEnd <=
                    currentTime
                ) {
                    activityEnd = null;

                    rejectedActivities.add(
                        activityKey
                    );

                    activity =
                        chooseNextActivity(
                            person,
                            johnActivityPreferences,
                            johnLocationPreferences,
                            activitiesWithinLimit.filter(
                                option =>
                                    !rejectedActivities.has(
                                        `${option.activity}:${option.locationId}`
                                    )
                            ),
                            previousActivity
                        );

                    continue;
                }

                /*
                 * If travel is required, make sure
                 * it is taken from the lower-priority
                 * side of the boundary.
                 */
                if (
                    travelTimeMinutes > 0
                ) {
                    const previousEntry =
                        entries[
                        entries.length - 1
                        ];

                    if (!previousEntry) {
                        console.log(
                            "Cannot schedule travel: no previous entry"
                        );

                        break;
                    }

                    const activityPriority =
                        getActivityPriority(
                            activity.activity
                        );

                    const activityEntry: SequentialPlanEntry = {
                        startTime: currentTime,
                        endTime: activityEnd,
                        activity: activity.activity,
                        location: activity.location,
                        locationId: activity.locationId,
                        priority: activityPriority
                    };

                    const lowerPriorityEntry =
                        comparePlanPriority(
                            previousEntry,
                            activityEntry
                        );

                    if (!lowerPriorityEntry) {
                        console.log(
                            "Cannot schedule travel: both entries are fixed",
                            {
                                activity: activity.activity,
                                from: currentLocation.id,
                                to: activityLocation.id,
                                travelTimeMinutes,
                                currentTime
                            }
                        );

                        break;
                    }

                    if (lowerPriorityEntry === previousEntry) {
                        const shortenedEntry =
                            cutPlanEntry(
                                previousEntry,
                                travelTimeMinutes
                            );

                        if (!shortenedEntry) {
                            console.log(
                                "Rejecting activity: travel cannot fit",
                                {
                                    activity: activity.activity,
                                    from: currentLocation.id,
                                    to: activityLocation.id,
                                    travelTimeMinutes,
                                    currentTime
                                }
                            );

                            rejectedActivities.add(
                                activityKey
                            );

                            activity =
                                chooseNextActivity(
                                    person,
                                    johnActivityPreferences,
                                    johnLocationPreferences,
                                    activitiesWithinLimit.filter(
                                        option =>
                                            !rejectedActivities.has(
                                                `${option.activity}:${option.locationId}`
                                            )
                                    ),
                                    previousActivity
                                );

                            continue;
                        }

                        entries[
                            entries.length - 1
                        ] = shortenedEntry;

                        entries.push(
                            createTravelPlanEntry(
                                shortenedEntry.endTime,
                                currentTime,
                                activity.locationId,
                                activity.location
                            )
                        );
                    } else {
                        const minimumDuration =
                            getMinimumActivityDuration(
                                activity.activity
                            );

                        const adjustedDuration =
                            duration - travelTimeMinutes;

                        if (
                            minimumDuration !== null &&
                            adjustedDuration < minimumDuration
                        ) {
                            console.log(
                                "Rejecting activity: travel would shorten activity below minimum",
                                {
                                    activity: activity.activity,
                                    duration,
                                    travelTimeMinutes,
                                    adjustedDuration,
                                    minimumDuration
                                }
                            );

                            rejectedActivities.add(
                                activityKey
                            );

                            activity =
                                chooseNextActivity(
                                    person,
                                    johnActivityPreferences,
                                    johnLocationPreferences,
                                    activitiesWithinLimit.filter(
                                        option =>
                                            !rejectedActivities.has(
                                                `${option.activity}:${option.locationId}`
                                            )
                                    ),
                                    previousActivity
                                );

                            continue;
                        }

                        const travelStart =
                            previousEntry.endTime;

                        const travelEnd = new Date(
                            travelStart.getTime() +
                            travelTimeMinutes *
                            60 *
                            1000
                        );

                        const adjustedActivityEnd = new Date(
                            travelEnd.getTime() +
                            adjustedDuration *
                            60 *
                            1000
                        );

                        if (
                            adjustedActivityEnd >
                            planEnd
                        ) {
                            console.log(
                                "Rejecting activity: fixed travel + activity would exceed plan",
                                {
                                    activity: activity.activity,
                                    travelStart,
                                    travelEnd,
                                    adjustedActivityEnd,
                                    planEnd
                                }
                            );

                            rejectedActivities.add(
                                activityKey
                            );

                            activity =
                                chooseNextActivity(
                                    person,
                                    johnActivityPreferences,
                                    johnLocationPreferences,
                                    activitiesWithinLimit.filter(
                                        option =>
                                            !rejectedActivities.has(
                                                `${option.activity}:${option.locationId}`
                                            )
                                    ),
                                    previousActivity
                                );

                            continue;
                        }

                        entries.push(
                            createTravelPlanEntry(
                                travelStart,
                                travelEnd,
                                activity.locationId,
                                activity.location
                            )
                        );

                        activityEnd = adjustedActivityEnd;

                        currentTime = travelEnd;
                    }
                }
            }

            /*
             * Waiting handled the gap before a
             * commitment. Go back to the outer loop
             * so the fixed commitment can be processed.
             */
            if (waitingForCommitment) {
                continue;
            }

            /*
             * No valid activity could be found.
             */
            if (!activity || !activityEnd) {
                console.log(
                    "Could not schedule an activity:",
                    {
                        time:
                            currentTime.toLocaleTimeString(
                                "en-GB"
                            ),
                        previousActivity
                    }
                );

                break;
            }

            entries.push({
                startTime: currentTime,
                endTime: activityEnd,
                activity: activity.activity,
                location: activity.location,
                locationId: activity.locationId,
                priority:
                    getActivityPriority(
                        activity.activity
                    )
            });

            console.log(
                "ADDING ACTIVITY:",
                {
                    activity:
                        activity.activity,
                    currentTime:
                        currentTime.toLocaleTimeString(
                            "en-GB"
                        ),
                    activityEnd:
                        activityEnd.toLocaleTimeString(
                            "en-GB"
                        ),
                    durationMinutes:
                        (
                            activityEnd.getTime() -
                            currentTime.getTime()
                        ) /
                        60000,
                    nextCommitment:
                        nextConcreteItem
                            ? {
                                start:
                                    nextConcreteItem.startTime
                                        .toLocaleTimeString(
                                            "en-GB"
                                        ),
                                end:
                                    nextConcreteItem.endTime
                                        .toLocaleTimeString(
                                            "en-GB"
                                        ),
                                activity:
                                    nextConcreteItem.activity
                            }
                            : null
                }
            );

            currentTime =
                activityEnd;

            previousActivity =
                activity.activity;

            activityCounts[
                activity.activity
            ] =
                (
                    activityCounts[
                    activity.activity
                    ] ?? 0
                ) + 1;
        }

    }

    return {
        date,
        entries
    };
}
