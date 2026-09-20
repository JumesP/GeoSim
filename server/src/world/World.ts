import type { WorldLocation } from "./types.js";
import type { Person } from "../person/Person.js";

export class World {
    private people: Person[] = [];
    private locations: WorldLocation[] = [];

    getPeople(): Person[] {
        return this.people;
    }

    getLocations(): WorldLocation[] {
        return this.locations;
    }

    addPerson(person: Person): void {
        this.people.push(person);
    }

    addLocation(location: WorldLocation): void {
        this.locations.push(location);
    }

    getPerson(id: string): Person | undefined {
        return this.people.find(person => person.id === id);
    }

    getLocation(id: string): WorldLocation | undefined {
        return this.locations.find(location => location.id === id);
    }

    getRequiredLocation(id: string): WorldLocation {
        const location = this.getLocation(id);

        if (!location) {
            throw new Error(
                `World location "${id}" not found`
            );
        }

        return location;
    }

    addGeneratedPerson(
        person: Person,
        locations: WorldLocation[]
    ): void {
        this.addPerson(person);

        for (const location of locations) {
            this.addLocation(location);
        }
    }

    getPersonByName(name: string): Person | undefined {
        return this.people.find(
            person =>
                person.name.toLowerCase() ===
                name.toLowerCase()
        );
    }
}
