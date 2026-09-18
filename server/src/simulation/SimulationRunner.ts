import { Simulation } from "./Simulation.js";

export class SimulationRunner {
    private readonly simulation: Simulation;

    private lastUpdate = Date.now();
    private interval: NodeJS.Timeout | null = null;

    constructor(simulation: Simulation) {
        this.simulation = simulation;
    }

    start(): void {
        if (this.interval) {
            return;
        }

        this.lastUpdate = Date.now();

        this.interval = setInterval(() => {
            const now = Date.now();

            const deltaSeconds =
                (now - this.lastUpdate) / 1000;

            this.lastUpdate = now;

            this.simulation.update(deltaSeconds);
        }, 100);
    }

    stop(): void {
        if (!this.interval) {
            return;
        }

        clearInterval(this.interval);
        this.interval = null;
    }
}