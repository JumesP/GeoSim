export type PlanPriority =
    | "low"
    | "normal"
    | "high"
    | "fixed";

export const planPriorityValues: Record<
    PlanPriority,
    number
> = {
    low: 10,
    normal: 30,
    high: 60,
    fixed: 100
};
