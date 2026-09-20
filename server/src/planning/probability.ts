export type Probability = number;

export function rollProbability(
    probability: Probability
): boolean {
    const clamped =
        Math.min(Math.max(probability, 0), 1);

    return Math.random() < clamped;
}
