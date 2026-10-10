import type { Span, SpanOption, WidgetDefinition } from "@/features/widgets/core/types";

export type SizeClass = "small" | "medium" | "large" | "tall";

export const sameSpan = (a: Span, b: Span) => a.w === b.w && a.h === b.h;

export const spanLabel = (span: SpanOption) => span.label ?? `${span.w}×${span.h}`;

// For views that prefer a few designed layouts over adapting to the frame.
export function sizeClass(span: Span): SizeClass {
    if (span.w >= 2 && span.h >= 2) return "large";
    if (span.w >= 2) return "medium";
    if (span.h >= 2) return "tall";
    return "small";
}

// Return possible spans fo certain variant
export const spansFor = (definition: WidgetDefinition, variant: string): SpanOption[] =>
    definition.variants[variant]?.spans ?? [];

// The span after `current` in the variant's list, wrapping around.
export function nextSpan(spans: SpanOption[], current: Span): Span {
    if (spans.length === 0) return current;
    const index = spans.findIndex((s) => sameSpan(s, current));
    const next = spans[(index + 1) % spans.length];
    return { w: next.w, h: next.h };
}

// Keeps `current` if the variant allows it, otherwise its first span.
export function fitSpan(spans: SpanOption[], current: Span): Span {
    if (spans.length === 0 || spans.some((s) => sameSpan(s, current))) return current;
    return { w: spans[0].w, h: spans[0].h };
}
