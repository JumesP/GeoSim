export type WeightedChoice<T> = {
    value: T;
    weight: number;
};

export function chooseWeighted<T>(
    choices: WeightedChoice<T>[]
): T | null {
    const totalWeight = choices.reduce(
        (total, choice) =>
            total + Math.max(choice.weight, 0),
        0
    );

    if (totalWeight === 0) {
        return null;
    }

    let roll = Math.random() * totalWeight;

    for (const choice of choices) {
        roll -= Math.max(choice.weight, 0);

        if (roll < 0) {
            return choice.value;
        }
    }

    return choices[choices.length - 1]?.value ?? null;
}
