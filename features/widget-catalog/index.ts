import { mealGroupsWidget } from "@/features/widget-catalog/meal-groups/definition";
import { nutritionWidget } from "@/features/widget-catalog/nutrition/definition";
import { recentWidget } from "@/features/widget-catalog/recent/definition";
import { catalogSources } from "@/features/widget-catalog/sources";
import { streakWidget } from "@/features/widget-catalog/streak/definition";
import { waterWidget } from "@/features/widget-catalog/water/definition";
import { createWidgetSystem } from "@/features/widgets";

// The app's widgets, bound to the app's data sources.
export const widgetSystem = createWidgetSystem({
    sources: catalogSources,
    widgets: [nutritionWidget, waterWidget, recentWidget, mealGroupsWidget, streakWidget],
});

export { DEFAULT_LAYOUT, migrateLegacyLayout } from "@/features/widget-catalog/migrateLegacyLayout";
