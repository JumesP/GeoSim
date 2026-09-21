import { chooseWeighted } from "../utilities/weightedChoice.js";

export type WakeTimeOption = {
    hour: number;
    weight: number;
};

const wakeTimeOptions: WakeTimeOption[] = [
    {
        hour: 6,
        weight: 20
    },
    {
        hour: 7,
        weight: 40
    },
    {
        hour: 8,
        weight: 40
    }
];

export function chooseWakeTime(): number | null {
    return chooseWeighted(
        wakeTimeOptions.map(option => ({
            value: option.hour,
            weight: option.weight
        }))
    );
}
