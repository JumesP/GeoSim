import express from "express";
import cors from "cors";

import { Simulation } from "./simulation/Simulation.js";
import { SimulationRunner } from "./simulation/SimulationRunner.js";
import { createWorld } from "./world/createWorld.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const world = createWorld();

const simulation = new Simulation(
    world,
    new Date("2026-09-18T06:00:00+01:00")
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

app.listen(PORT, () => {
    runner.start();

    console.log(`GeoSim server running on http://localhost:${PORT}`);
});
