import type { Person, WorldLocation } from "./types.js";

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
}