import { generateSequentialPlan } from "../generateSequentialPlan.js";
import { createWorld } from "../../world/createWorld.js";
import { createJohn } from "../../person/generator.js";

const world = createWorld();

const { person } = createJohn(world);

const date = new Date(
    2026,
    8, // September
    21
);

date.setHours(0, 0, 0, 0);

console.log("Person:", person);
console.log(
    "Home:",
    person.getLocation("home")
);

const plan = generateSequentialPlan(
    person,
    world,
    date,
    "sleeping"
);

console.log(
    "Plan generated:",
    plan
);

for (const entry of plan.entries) {
    console.log(
        `${entry.startTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        })} → ` +
        `${entry.endTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        })} | ` +
        `${entry.activity} | ` +
        `${entry.locationId}` +
        (entry.idleActivity
            ? ` | idle: ${entry.idleActivity}`
            : "")
    );
}
