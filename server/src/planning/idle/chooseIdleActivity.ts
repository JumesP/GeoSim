import { IdleActivity } from "./IdleActivity.js";

const idleActivities: IdleActivity[] = [
    "walking_around",
    "on_phone",
    "looking_around",
    "waiting"
];

export function chooseIdleActivity(
    previousActivity?: IdleActivity
): IdleActivity {
    const availableActivities =
        previousActivity
            ? idleActivities.filter(
                activity =>
                    activity !== previousActivity
            )
            : idleActivities;

    const index = Math.floor(
        Math.random() * availableActivities.length
    );

    return availableActivities[index]!;
}
