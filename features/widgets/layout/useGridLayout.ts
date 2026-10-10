import { useEffect, useMemo, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import type { GridConfig } from "@/features/widgets/core/types";
import {
    packGrid,
    type PackableItem,
    type PackedRect,
    type PackResult,
} from "@/features/widgets/layout/packGrid";

const EMPTY: PackResult = { rects: {}, totalHeight: 0, emptySlots: [] };

export function resolveGrid(grid: GridConfig, width: number) {
    const columns = Math.max(
        1,
        Math.floor(typeof grid.columns === "function" ? grid.columns(width) : grid.columns)
    );
    const colWidth = Math.max(0, (width - grid.gap * (columns - 1)) / columns);
    const rowHeight = grid.rowHeight === "square" ? colWidth : grid.rowHeight;
    return { columns, colWidth, rowHeight, gap: grid.gap };
}

interface UseGridLayoutOptions {
    items: PackableItem[];
    grid: GridConfig;
    // While editing, the grid grows to fit the add slot past the content.
    editing: boolean;
}

// Pure layout data for rendering — deliberately no refs in here, so
// components can read it during render.
export function useGridLayout({ items, grid, editing }: UseGridLayoutOptions) {
    const [width, setWidth] = useState(0);
    const metrics = useMemo(() => resolveGrid(grid, width), [grid, width]);

    // Keyed on spans, not the array identity, so callers can pass a fresh
    // array each render without re-packing.
    const itemsKey = items.map((i) => `${i.id}:${i.span.w}x${i.span.h}`).join("|");
    const { rects, totalHeight, emptySlots } = useMemo(
        () =>
            width > 0
                ? packGrid(items, {
                      columns: metrics.columns,
                      containerWidth: width,
                      rowHeight: metrics.rowHeight,
                      gap: metrics.gap,
                  })
                : EMPTY,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [itemsKey, width, metrics]
    );

    const height = editing
        ? Math.max(totalHeight, ...emptySlots.map((s) => s.rect.y + s.rect.height), 0)
        : totalHeight;

    // Mirrored into a shared value so the drag gesture can hit-test on the
    // UI thread without crossing back to JS every frame.
    const rectsShared = useSharedValue<Record<string, PackedRect>>({});
    useEffect(() => {
        rectsShared.value = rects;
    }, [rects, rectsShared]);

    const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

    return { onLayout, metrics, rects, emptySlots, height, rectsShared };
}

export type GridLayout = ReturnType<typeof useGridLayout>;
