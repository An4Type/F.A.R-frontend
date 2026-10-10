import { router } from "expo-router";
import { metricsSection } from "@/features/widget-catalog/nutrition/MetricsSection";
import { NutritionRingsView } from "@/features/widget-catalog/nutrition/RingsView";
import type { NutritionData, NutritionSettings } from "@/features/widget-catalog/nutrition/types";
import { defineCatalogWidget } from "@/features/widget-catalog/sources";
import { spanSection } from "@/features/widgets";

// No per-macro goals exist in the profile yet.
const MACRO_GOALS = { carbs: 250, protein: 150, fat: 70 };

export const nutritionWidget = defineCatalogWidget<NutritionData, NutritionSettings>({
    type: "nutrition",
    label: "Nutrition",
    icon: "nutrition-outline",

    sources: ["today"],
    select: ({ today }) => ({
        values: { calories: today.calories, ...today.macros },
        goals: { calories: today.caloriesGoal, ...MACRO_GOALS },
    }),
    previewData: {
        values: { calories: 1850, carbs: 180, protein: 120, fat: 55 },
        goals: { calories: 2500, ...MACRO_GOALS },
    },

    defaultSettings: { metrics: ["calories"] },
    defaultVariant: "rings",
    variants: {
        rings: {
            label: "Rings",
            spans: [
                { w: 1, h: 1, label: "Small" },
                { w: 2, h: 1, label: "Medium" },
                { w: 2, h: 2, label: "Large" },
            ],
            View: NutritionRingsView,
        },
    },

    settingsSections: [spanSection, metricsSection],
    onPress: () => router.push("/history"),
});
