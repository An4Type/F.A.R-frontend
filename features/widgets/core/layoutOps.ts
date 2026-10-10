import { spansFor } from "@/features/widgets/core/spans";
import type { Span, WidgetDefinition, WidgetInstance } from "@/features/widgets/core/types";

// Pure operations on a layout. The board calls these and hands the result
// to the app's onLayoutChange; nothing here persists.

export function createInstance(
    definition: WidgetDefinition,
    variant = definition.defaultVariant,
    span?: Span
): WidgetInstance {
    const first = spansFor(definition, variant)[0] ?? { w: 1, h: 1 };
    return {
        // unique id handling
        id: `${definition.type}-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6)}`,
        type: definition.type,
        variant,
        span: span ?? { w: first.w, h: first.h },
        settings: definition.defaultSettings,
    };
}

export function insertAt(layout: WidgetInstance[], widget: WidgetInstance, index: number) {
    const next = [...layout];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, widget);
    return next;
}

export const removeById = (layout: WidgetInstance[], id: string) =>
    layout.filter((w) => w.id !== id);

export const updateById = (layout: WidgetInstance[], id: string, patch: Partial<WidgetInstance>) =>
    layout.map((w) => (w.id === id ? { ...w, ...patch } : w));

// Moves `fromId` into `toId`'s position.
export function reorder(layout: WidgetInstance[], fromId: string, toId: string) {
    const from = layout.findIndex((w) => w.id === fromId);
    const to = layout.findIndex((w) => w.id === toId);
    if (from < 0 || to < 0 || from === to) return layout;
    const next = [...layout];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}
