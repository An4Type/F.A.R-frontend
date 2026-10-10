import type { Span, WidgetInstance } from "@/features/widgets";

// Saved layouts from before the widget engine stored a size name instead of
// a span and variant, and had no per-widget settings.
interface LegacyWidget {
    id: string;
    type: string;
    size: "small" | "medium" | "large" | "medium-h";
    metrics?: string[];
}

const SPAN_BY_SIZE: Record<LegacyWidget["size"], Span> = {
    small: { w: 1, h: 1 },
    medium: { w: 2, h: 1 },
    large: { w: 2, h: 2 },
    "medium-h": { w: 1, h: 2 },
};

const VARIANT_BY_TYPE: Record<string, string> = {
    nutrition: "rings",
    water: "ring",
    recent: "list",
    categories: "list",
    streak: "flame",
};

function migrateWidget(widget: LegacyWidget): WidgetInstance {
    const base = {
        id: widget.id,
        type: widget.type,
        variant: VARIANT_BY_TYPE[widget.type] ?? "default",
        span: SPAN_BY_SIZE[widget.size] ?? SPAN_BY_SIZE.small,
        settings: {},
    };
    if (widget.type === "nutrition") {
        return { ...base, settings: { metrics: widget.metrics ?? ["calories"] } };
    }
    if (widget.type === "water") {
        // The water goal used to be global; widgets start from the old default.
        return {
            ...base,
            variant: widget.size === "medium-h" ? "bottle" : "ring",
            settings: { goalMl: 2000, glassMl: 250 },
        };
    }
    return base;
}

export const migrateLegacyLayout = (widgets: LegacyWidget[]): WidgetInstance[] =>
    widgets.map(migrateWidget);

export const DEFAULT_LAYOUT: WidgetInstance[] = migrateLegacyLayout([
    {
        id: "w-nutrition",
        type: "nutrition",
        size: "large",
        metrics: ["calories", "carbs", "protein", "fat"],
    },
    { id: "w-water", type: "water", size: "small" },
    { id: "w-recent", type: "recent", size: "medium" },
    { id: "w-categories", type: "categories", size: "medium" },
    { id: "w-streak", type: "streak", size: "medium" },
]);
