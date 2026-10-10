import { router } from "expo-router";
import { RecentView, type RecentFood } from "@/features/widget-catalog/recent/RecentView";
import { defineCatalogWidget } from "@/features/widget-catalog/sources";

export const recentWidget = defineCatalogWidget<RecentFood[], object>({
    type: "recent",
    label: "Recent foods",
    icon: "time-outline",

    sources: ["today"],
    select: ({ today }) => today.foods,
    previewData: [
        { name: "Greek Yogurt", calories: 130 },
        { name: "Grilled Chicken", calories: 320 },
        { name: "Brown Rice", calories: 215 },
        { name: "Banana", calories: 105 },
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
            View: RecentView,
        },
    },

    onPress: () => router.push("/explore"),
});
