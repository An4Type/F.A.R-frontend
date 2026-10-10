import type { Span } from "@/features/widgets/core/types";

// React Native has no CSS Grid — this replicates `grid-auto-flow: row`
// (sequential, not `dense`): items are placed in array order and the
// packing cursor only moves forward, so a later, smaller widget never
// backfills a gap an earlier, larger one left behind. Gaps surface as
// EmptySlots ("Add widget" tiles in edit mode). Widgets are then rendered
// absolutely positioned at the pixel rects this produces.

export interface PackableItem {
    id: string;
    span: Span;
}

export interface PackedRect {
    row: number;
    col: number;
    colSpan: number;
    rowSpan: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

// An open cell. `insertIndex` is where a new widget should be spliced into
// the source array so that re-packing places it into this exact cell.
export interface EmptySlot {
    insertIndex: number;
    rect: PackedRect;
}

export interface PackResult {
    rects: Record<string, PackedRect>;
    totalHeight: number;
    emptySlots: EmptySlot[];
}

export interface PackOptions {
    columns: number;
    containerWidth: number;
    rowHeight: number;
    gap: number;
}

export function packGrid(
    items: PackableItem[],
    { columns, containerWidth, rowHeight, gap }: PackOptions
): PackResult {
    const colWidth = (containerWidth - gap * (columns - 1)) / columns;
    const occupied: boolean[][] = [];

    const isFree = (row: number, col: number, w: number, h: number) => {
        for (let dr = 0; dr < h; dr++) {
            for (let dc = 0; dc < w; dc++) {
                if (occupied[row + dr]?.[col + dc]) return false;
            }
        }
        return true;
    };

    const occupy = (row: number, col: number, w: number, h: number) => {
        for (let dr = 0; dr < h; dr++) {
            occupied[row + dr] ??= [];
            for (let dc = 0; dc < w; dc++) occupied[row + dr][col + dc] = true;
        }
    };

    const rectAt = (row: number, col: number, w: number, h: number): PackedRect => ({
        row,
        col,
        colSpan: w,
        rowSpan: h,
        x: col * (colWidth + gap),
        y: row * (rowHeight + gap),
        width: w * colWidth + (w - 1) * gap,
        height: h * rowHeight + (h - 1) * gap,
    });

    let cursorRow = 0;
    let cursorCol = 0;
    const advance = (by: number) => {
        cursorCol += by;
        if (cursorCol >= columns) {
            cursorCol = 0;
            cursorRow++;
        }
    };

    const rects: Record<string, PackedRect> = {};
    const order: { index: number; readingKey: number }[] = [];
    let maxRow = 0;

    items.forEach((item, index) => {
        // A span wider than the grid (e.g. after the column count shrinks)
        // is clamped instead of never fitting.
        const w = Math.min(Math.max(1, item.span.w), columns);
        const h = Math.max(1, item.span.h);
        while (cursorCol + w > columns || !isFree(cursorRow, cursorCol, w, h)) advance(1);

        const row = cursorRow;
        const col = cursorCol;
        occupy(row, col, w, h);
        advance(w);

        rects[item.id] = rectAt(row, col, w, h);
        order.push({ index, readingKey: row * columns + col });
        maxRow = Math.max(maxRow, row + h);
    });

    const emptySlots: EmptySlot[] = [];
    for (let row = 0; row < maxRow; row++) {
        for (let col = 0; col < columns; col++) {
            if (occupied[row]?.[col]) continue;
            const readingKey = row * columns + col;
            const next = order.find((o) => o.readingKey > readingKey);
            emptySlots.push({
                insertIndex: next ? next.index : items.length,
                rect: rectAt(row, col, 1, 1),
            });
        }
    }
    // Always-visible slot one row past all content, so there's somewhere to
    // add a widget even when the grid has no gaps.
    emptySlots.push({ insertIndex: items.length, rect: rectAt(maxRow, 0, 1, 1) });

    const totalHeight = maxRow > 0 ? maxRow * rowHeight + (maxRow - 1) * gap : 0;
    return { rects, totalHeight, emptySlots };
}
