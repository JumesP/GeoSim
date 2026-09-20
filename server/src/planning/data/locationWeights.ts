import type { PersonLocation } from "../../person/Person.js";

export const locationRelationshipWeights:
    Record<PersonLocation["relationship"], number> = {
    home: 100,
    work: 100,
    favourite: 30,
    regular: 10
};
