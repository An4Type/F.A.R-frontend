import { sql } from "drizzle-orm";
import {
    check,
    index,
    integer,
    primaryKey,
    real,
    sqliteTable,
    text,
    type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { allergen, category, food, nutrient } from "@/lib/db/schema/catalog";
import { exactlyOne, syncColumns } from "@/lib/db/schema/columns";
import { appUser } from "@/lib/db/schema/user";

// Foods the user adds or adjusts, and the lookups (servings, barcodes) that
// can be global (`user_id` null, from the server) or the user's own.

export const userFood = sqliteTable(
    "user_food",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        base_food_id: integer().references(() => food.id),
        is_recipe: integer({ mode: "boolean" }).notNull().default(false),
        recipe_yield_g: real(),
        name: text(),
        category_id: integer().references(() => category.id),
        kcal_per_100g: integer(),
        fat_g_per_100g: real(),
        carbs_g_per_100g: real(),
        protein_g_per_100g: real(),
        info: text(),
        additional_info: text({ mode: "json" }).$type<Record<string, unknown>>(),
        ...syncColumns,
    },
    (t) => [
        index("user_food_base_idx").on(t.base_food_id),
        check(
            "user_food_own_food_complete",
            sql`${t.base_food_id} IS NOT NULL OR (
                ${t.name} IS NOT NULL AND ${t.category_id} IS NOT NULL
                AND ${t.kcal_per_100g} IS NOT NULL AND ${t.fat_g_per_100g} IS NOT NULL
                AND ${t.carbs_g_per_100g} IS NOT NULL AND ${t.protein_g_per_100g} IS NOT NULL
            )`
        ),
        check("user_food_recipe_no_base", sql`NOT ${t.is_recipe} OR ${t.base_food_id} IS NULL`),
        check("user_food_recipe_yield", sql`${t.is_recipe} = (${t.recipe_yield_g} IS NOT NULL)`),
    ]
);

export const userFoodIngredient = sqliteTable(
    "user_food_ingredient",
    {
        id: text().primaryKey(),
        user_food_id: text()
            .notNull()
            .references((): AnySQLiteColumn => userFood.id),
        food_id: integer().references(() => food.id),
        ingredient_user_food_id: text().references((): AnySQLiteColumn => userFood.id),
        quantity_g: real().notNull(),
        sort_order: integer().notNull().default(0),
        ...syncColumns,
    },
    (t) => [
        index("user_food_ingredient_recipe_idx").on(t.user_food_id),
        check("user_food_ingredient_food_ref", exactlyOne(t.food_id, t.ingredient_user_food_id)),
        check(
            "user_food_ingredient_not_self",
            sql`${t.ingredient_user_food_id} IS NULL OR ${t.ingredient_user_food_id} <> ${t.user_food_id}`
        ),
    ]
);

export const userFoodNutrient = sqliteTable(
    "user_food_nutrient",
    {
        user_food_id: text()
            .notNull()
            .references(() => userFood.id),
        nutrient_id: integer()
            .notNull()
            .references(() => nutrient.id),
        amount_per_100g: real().notNull(),
        ...syncColumns,
    },
    (t) => [primaryKey({ columns: [t.user_food_id, t.nutrient_id] })]
);

export const userFoodAllergen = sqliteTable(
    "user_food_allergen",
    {
        user_food_id: text()
            .notNull()
            .references(() => userFood.id),
        allergen_id: integer()
            .notNull()
            .references(() => allergen.id),
        ...syncColumns,
    },
    (t) => [primaryKey({ columns: [t.user_food_id, t.allergen_id] })]
);

export const foodServing = sqliteTable(
    "food_serving",
    {
        id: text().primaryKey(),
        user_id: text().references(() => appUser.id),
        food_id: integer().references(() => food.id),
        user_food_id: text().references(() => userFood.id),
        label: text().notNull(),
        grams: real().notNull(),
        is_default: integer({ mode: "boolean" }).notNull().default(false),
        ...syncColumns,
    },
    (t) => [
        index("food_serving_food_idx").on(t.food_id),
        index("food_serving_user_food_idx").on(t.user_food_id),
        check("food_serving_food_ref", exactlyOne(t.food_id, t.user_food_id)),
    ]
);

export const foodBarcode = sqliteTable(
    "food_barcode",
    {
        id: text().primaryKey(),
        code: text().notNull(),
        user_id: text().references(() => appUser.id),
        food_id: integer().references(() => food.id),
        user_food_id: text().references(() => userFood.id),
        source: text({ enum: ["catalog", "open_food_facts", "user"] }).notNull(),
        ...syncColumns,
    },
    (t) => [
        index("food_barcode_code_idx").on(t.code),
        check("food_barcode_food_ref", exactlyOne(t.food_id, t.user_food_id)),
    ]
);
