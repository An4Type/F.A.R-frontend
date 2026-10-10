import { defineCatalogWidget } from "@/features/widget-catalog/sources";
import { WaterBottleView } from "@/features/widget-catalog/water/BottleView";
import { WaterRingView } from "@/features/widget-catalog/water/RingView";
import type { WaterData, WaterSettings } from "@/features/widget-catalog/water/types";
import { waterGoalSection } from "@/features/widget-catalog/water/WaterGoalSection";
import { DEFAULT_QUICK_ACTIONS, spanSection, variantSection, fitSpan } from "@/features/widgets";
export const waterWidget = defineCatalogWidget<WaterData, WaterSettings>({
    type: "water",
    label: "Water",
    icon: "water-outline",

    sources: ["water"],
    select: ({ water }, settings) => ({ ...settings, ...water }),
    previewData: { goalMl: 2000, glassMl: 250, consumedMl: 1250, addWater: () => {} },

    defaultSettings: { goalMl: 2000, glassMl: 250 },
    defaultVariant: "ring",
    variants: {
        ring: {
            label: "Ring",
            icon: "ellipse-outline",
            spans: [
                { w: 1, h: 1, label: "Small" },
                { w: 2, h: 1, label: "Medium" },
                { w: 2, h: 2, label: "Large" },
            ],
            View: WaterRingView,
        },
        bottle: {
            label: "Bottle",
            icon: "flask-outline",
            spans: [{ w: 1, h: 2, label: "Tall" }],
            View: WaterBottleView,
        },
    },
    quickActions: [
        {
            key: "change_style",
            icon: "color-palette-outline",
            onPress: ({ widget, spansFor, update }) => {
                const variant = widget.variant === "ring" ? "bottle" : "ring";
                update({ variant, span: fitSpan(spansFor(variant), widget.span) });
            },
        },
        ...DEFAULT_QUICK_ACTIONS,
    ],

    settingsSections: [variantSection, spanSection, waterGoalSection],
});
