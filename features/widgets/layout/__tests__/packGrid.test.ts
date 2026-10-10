import { packGrid, type PackableItem } from "@/features/widgets/layout/packGrid";

// 2 columns of 100px with a 10px gap: container = 210, row height = 100.
const TWO_COLUMNS = { columns: 2, containerWidth: 210, rowHeight: 100, gap: 10 };
const item = (id: string, w: number, h: number): PackableItem => ({ id, span: { w, h } });

describe("packGrid", () => {
    it("places 1×1 widgets left-to-right, then wraps to the next row", () => {
        const { rects, totalHeight } = packGrid(
            [item("a", 1, 1), item("b", 1, 1), item("c", 1, 1)],
            TWO_COLUMNS
        );

        expect(rects.a).toMatchObject({ row: 0, col: 0, x: 0, y: 0, width: 100, height: 100 });
        expect(rects.b).toMatchObject({ row: 0, col: 1, x: 110, y: 0 });
        expect(rects.c).toMatchObject({ row: 1, col: 0, x: 0, y: 110 });
        expect(totalHeight).toBe(210);
    });

    it("never backfills an earlier gap with a later, smaller widget", () => {
        const { rects, emptySlots } = packGrid(
            [item("a", 1, 1), item("b", 2, 1), item("c", 1, 1)],
            TWO_COLUMNS
        );

        // "b" spans both columns, so it moves to row 1 and leaves (0, 1) empty;
        // "c" comes after it instead of jumping back into that gap.
        expect(rects.b).toMatchObject({ row: 1, col: 0, width: 210 });
        expect(rects.c).toMatchObject({ row: 2, col: 0 });
        expect(emptySlots[0]).toMatchObject({ insertIndex: 1, rect: { row: 0, col: 1 } });
    });

    it("packs tall spans around their neighbours", () => {
        const { rects } = packGrid(
            [item("a", 1, 2), item("b", 1, 1), item("c", 1, 1)],
            TWO_COLUMNS
        );

        expect(rects.a).toMatchObject({ row: 0, col: 0, height: 210 });
        expect(rects.b).toMatchObject({ row: 0, col: 1 });
        expect(rects.c).toMatchObject({ row: 1, col: 1 });
    });

    it("lays out across any column count", () => {
        const { rects } = packGrid([item("a", 2, 1), item("b", 1, 1), item("c", 1, 1)], {
            columns: 4,
            containerWidth: 430,
            rowHeight: 100,
            gap: 10,
        });

        expect(rects.a).toMatchObject({ row: 0, col: 0, width: 210 });
        expect(rects.b).toMatchObject({ row: 0, col: 2, x: 220 });
        expect(rects.c).toMatchObject({ row: 0, col: 3, x: 330 });
    });

    it("clamps spans wider than the grid", () => {
        const { rects } = packGrid([item("a", 4, 1)], TWO_COLUMNS);

        expect(rects.a).toMatchObject({ colSpan: 2, width: 210 });
    });

    it("always offers an add slot one row past the content", () => {
        const { emptySlots } = packGrid([item("a", 2, 2)], TWO_COLUMNS);

        expect(emptySlots.at(-1)).toMatchObject({ insertIndex: 1, rect: { row: 2, col: 0 } });
    });

    it("returns an empty grid for no widgets", () => {
        const { rects, totalHeight } = packGrid([], TWO_COLUMNS);

        expect(rects).toEqual({});
        expect(totalHeight).toBe(0);
    });
});
