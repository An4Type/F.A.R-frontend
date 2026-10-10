import type { Nutrient } from "@/features/food";
import { sizeClass, type Span } from "@/features/widgets";

export interface NutritionSettings {
    metrics: Nutrient[];
}

export interface NutritionData {
    values: Record<Nutrient, number>;
    goals: Record<Nutrient, number>;
}

const MAX_RINGS = { small: 1, medium: 2, tall: 2, large: 4 };

// How many rings fit at a span. Extra picks stay saved but aren't shown.
export const maxRingsFor = (span: Span) => MAX_RINGS[sizeClass(span)];
