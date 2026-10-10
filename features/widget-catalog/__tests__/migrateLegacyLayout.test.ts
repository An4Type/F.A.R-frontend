import { migrateLegacyLayout } from "@/features/widget-catalog/migrateLegacyLayout";

describe("migrateLegacyLayout", () => {
    it("maps size names to spans", () => {
        const [small, medium, large] = migrateLegacyLayout([
            { id: "a", type: "streak", size: "small" },
            { id: "b", type: "streak", size: "medium" },
            { id: "c", type: "streak", size: "large" },
        ]);

        expect(small.span).toEqual({ w: 1, h: 1 });
        expect(medium.span).toEqual({ w: 2, h: 1 });
        expect(large.span).toEqual({ w: 2, h: 2 });
        expect(large.variant).toBe("flame");
    });

    it("turns the old tall water size into the bottle variant", () => {
        const [water] = migrateLegacyLayout([{ id: "w", type: "water", size: "medium-h" }]);

        expect(water).toMatchObject({
            variant: "bottle",
            span: { w: 1, h: 2 },
            settings: { goalMl: 2000, glassMl: 250 },
        });
    });

    it("keeps nutrition metrics as settings", () => {
        const [nutrition] = migrateLegacyLayout([
            { id: "n", type: "nutrition", size: "large", metrics: ["carbs", "fat"] },
        ]);

        expect(nutrition).toMatchObject({
            variant: "rings",
            settings: { metrics: ["carbs", "fat"] },
        });
    });
});
