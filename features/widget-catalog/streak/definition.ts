import { router } from "expo-router";
import { defineCatalogWidget } from "@/features/widget-catalog/sources";
import { StreakView, type StreakData } from "@/features/widget-catalog/streak/StreakView";

export const streakWidget = defineCatalogWidget<StreakData, object>({
    type: "streak",
    label: "Streak",
    icon: "flame-outline",

    sources: ["week"],
    select: ({ week }) => {
        const goalMetDays = week.days.map((d) => d.calories <= week.caloriesGoal);
        let streakDays = 0;
        for (let i = goalMetDays.length - 1; i >= 0 && goalMetDays[i]; i--) streakDays++;
        const weekAvgCal =
            week.days.length > 0
                ? Math.round(week.days.reduce((sum, d) => sum + d.calories, 0) / week.days.length)
                : 0;
        return { goalMetDays, streakDays, weekAvgCal };
    },
    previewData: {
        streakDays: 4,
        weekAvgCal: 2150,
        goalMetDays: [true, false, true, true, true, true, false],
    },

    defaultSettings: {},
    defaultVariant: "flame",
    variants: {
        flame: {
            label: "Flame",
            spans: [
                { w: 1, h: 1, label: "Small" },
                { w: 2, h: 1, label: "Medium" },
                { w: 2, h: 2, label: "Large" },
            ],
            View: StreakView,
        },
    },

    onPress: () => router.push("/history"),
});
