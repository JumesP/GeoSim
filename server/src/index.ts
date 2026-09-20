import express from "express";
import cors from "cors";

import { Simulation } from "./simulation/Simulation.js";
import { SimulationRunner } from "./simulation/SimulationRunner.js";
import { createWorld } from "./world/createWorld.js";
import { generateDailyPlan } from "./planning/generateDailyPlan.js";

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const world = createWorld();

const john = world.getPerson("john");

if (john) {
    console.log(
        generateDailyPlan(
            john,
            new Date("2026-09-18T06:00:00Z")
        )
    );
}

const simulation = new Simulation(
    world,
    new Date("2026-09-18T06:00:00")
);
const runner = new SimulationRunner(simulation);

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "GeoSim server"
    });
});

app.get("/api/world", (_req, res) => {
    const world = simulation.getWorld();

    res.json({
        time: simulation.getTime(),
        speed: simulation.getSpeed(),
        people: world.getPeople(),
        locations: world.getLocations()
    });
});

app.post("/api/simulation/speed", (req, res) => {
    const speed = req.body.speed;

    simulation.setSpeed(speed);

    res.json({
        speed: simulation.getSpeed()
    });
});

app.get("/api/time", (_req, res) => {
    res.json({
        time: simulation.getTime(),
        speed: simulation.getSpeed()
    });
});

app.get("/api/people/:name/plan", (req, res) => {
    const person =
        world.getPersonByName(req.params.name);

    if (!person) {
        res.status(404).json({
            error: "Person not found"
        });
        return;
    }

    const date =
        req.query.date
            ? new Date(String(req.query.date))
            : simulation.getTime();

    if (Number.isNaN(date.getTime())) {
        res.status(400).json({
            error: "Invalid date"
        });
        return;
    }

    const plan =
        generateDailyPlan(person, date);

    res.json({
        person: {
            id: person.id,
            name: person.name,
            age: person.age
        },
        plan
    });
});

app.listen(PORT, () => {
    runner.start();

    console.log(`GeoSim server running on http://localhost:${PORT}`);
});
