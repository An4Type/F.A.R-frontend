import { food, logEntry, mealGroup, reminder, userFood, userFoodIngredient } from "@/lib/contracts";

const USER = "0192f3a4-5b6c-7d8e-9f01-23456789abcd";
const OTHER = "0192f3a4-5b6c-7d8e-9f01-23456789abce";
const SERVING = "0192f3a4-5b6c-7d8e-9f01-23456789abcf";
const NOW = "2026-10-21T08:15:00Z";

const sync = { updated_at: NOW, deleted_at: null, version: 1 };

const validLogEntry = {
    id: OTHER,
    user_id: USER,
    food_id: 12,
    user_food_id: null,
    meal_group_id: null,
    saved_meal_id: null,
    serving_id: null,
    serving_count: null,
    quantity_g: 150,
    consumed_at: NOW,
    local_date: "2026-10-21",
    source: "manual",
    ai_confidence: null,
    name_snapshot: "Oatmeal",
    serving_label_snapshot: null,
    kcal_snapshot: 210,
    fat_g_snapshot: 4.5,
    carbs_g_snapshot: 36,
    protein_g_snapshot: 7.25,
    ...sync,
};

const ownFood = {
    id: OTHER,
    user_id: USER,
    base_food_id: null,
    is_recipe: false,
    recipe_yield_g: null,
    name: "Granola",
    category_id: 3,
    kcal_per_100g: 450,
    fat_g_per_100g: 15,
    carbs_g_per_100g: 65,
    protein_g_per_100g: 10,
    info: null,
    additional_info: null,
    ...sync,
};

describe("contracts", () => {
    it("accepts a catalog food in the wire format", () => {
        const result = food.safeParse({
            id: 1,
            name: "Apple",
            category_id: 2,
            kcal_per_100g: 52,
            fat_g_per_100g: 0.17,
            carbs_g_per_100g: 13.81,
            protein_g_per_100g: 0.26,
            info: null,
            additional_info: null,
            updated_at: NOW,
            is_active: true,
        });
        expect(result.success).toBe(true);
    });

    it("requires exactly one food reference on a log entry", () => {
        expect(logEntry.safeParse(validLogEntry).success).toBe(true);
        expect(logEntry.safeParse({ ...validLogEntry, user_food_id: USER }).success).toBe(false);
        expect(logEntry.safeParse({ ...validLogEntry, food_id: null }).success).toBe(false);
    });

    it("requires serving id and count together", () => {
        const withServing = { ...validLogEntry, serving_id: SERVING, serving_count: 2 };
        expect(logEntry.safeParse(withServing).success).toBe(true);
        expect(logEntry.safeParse({ ...withServing, serving_count: null }).success).toBe(false);
    });

    it("ties ai_confidence to ai_photo entries", () => {
        const aiEntry = { ...validLogEntry, source: "ai_photo", ai_confidence: 0.92 };
        expect(logEntry.safeParse(aiEntry).success).toBe(true);
        expect(logEntry.safeParse({ ...aiEntry, ai_confidence: null }).success).toBe(false);
        expect(logEntry.safeParse({ ...validLogEntry, ai_confidence: 0.5 }).success).toBe(false);
    });

    it("requires nutrition on an own food but not on an override", () => {
        expect(userFood.safeParse(ownFood).success).toBe(true);
        expect(userFood.safeParse({ ...ownFood, kcal_per_100g: null }).success).toBe(false);

        const override = {
            ...ownFood,
            base_food_id: 7,
            name: null,
            category_id: null,
            kcal_per_100g: 400,
            fat_g_per_100g: null,
            carbs_g_per_100g: null,
            protein_g_per_100g: null,
        };
        expect(userFood.safeParse(override).success).toBe(true);
    });

    it("keeps recipes consistent", () => {
        const recipe = { ...ownFood, is_recipe: true, recipe_yield_g: 800 };
        expect(userFood.safeParse(recipe).success).toBe(true);
        expect(userFood.safeParse({ ...recipe, recipe_yield_g: null }).success).toBe(false);
        expect(userFood.safeParse({ ...recipe, base_food_id: 7 }).success).toBe(false);
    });

    it("rejects a recipe containing itself", () => {
        const ingredient = {
            id: SERVING,
            user_food_id: OTHER,
            food_id: null,
            ingredient_user_food_id: OTHER,
            quantity_g: 100,
            sort_order: 0,
            ...sync,
        };
        expect(userFoodIngredient.safeParse(ingredient).success).toBe(false);
    });

    it("requires a meal group's time window to be complete", () => {
        const group = {
            id: OTHER,
            user_id: USER,
            meal_type_id: 1,
            name: "Morning",
            icon: "sunny-outline",
            start_time: "06:00",
            end_time: "10:30",
            target_kcal: 500,
            target_fat_g: null,
            target_carbs_g: null,
            target_protein_g: null,
            sort_order: 0,
            is_archived: false,
            ...sync,
        };
        expect(mealGroup.safeParse(group).success).toBe(true);
        expect(mealGroup.safeParse({ ...group, end_time: null }).success).toBe(false);
    });

    it("links meal reminders to a meal group", () => {
        const water = {
            id: OTHER,
            user_id: USER,
            kind: "water",
            meal_group_id: null,
            time: "12:00",
            days_of_week: 127,
            is_enabled: true,
            ...sync,
        };
        expect(reminder.safeParse(water).success).toBe(true);
        expect(reminder.safeParse({ ...water, kind: "meal" }).success).toBe(false);
    });
});
