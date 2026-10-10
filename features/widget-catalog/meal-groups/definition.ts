import type { MealGroup } from "@/features/food";
import { MealGroupsView } from "@/features/widget-catalog/meal-groups/MealGroupsView";
import { defineCatalogWidget } from "@/features/widget-catalog/sources";

export const mealGroupsWidget = defineCatalogWidget<MealGroup[], object>({
    type: "categories",
    label: "Meal groups",
    icon: "grid-outline",

    sources: ["mealGroups"],
    select: ({ mealGroups }) => mealGroups.groups,
    previewData: [
        { id: "p1", name: "Breakfast", icon: "cafe-outline", consumed: 420, goal: 600 },
        { id: "p2", name: "Lunch", icon: "restaurant-outline", consumed: 650, goal: 900 },
        { id: "p3", name: "Dinner", icon: "moon-outline", consumed: 0, goal: 1200 },
    ],

    defaultSettings: {},
    defaultVariant: "list",
    variants: {
        list: {
            label: "List",
            spans: [
                { w: 1, h: 1, label: "Small" },
                { w: 2, h: 1, label: "Medium" },
                { w: 2, h: 2, label: "Large" },
            ],
            View: MealGroupsView,
        },
    },
});
