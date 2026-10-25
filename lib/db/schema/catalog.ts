import {
    index,
    integer,
    primaryKey,
    real,
    sqliteTable,
    text,
    type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

// Server-owned reference data: pulled from server only, never written locally
// except by sync.

export const category = sqliteTable("category", {
    id: integer().primaryKey(),
    parent_id: integer().references((): AnySQLiteColumn => category.id),
    slug: text().notNull().unique(),
    name: text().notNull(),
    icon: text().notNull(),
    sort_order: integer().notNull().default(0),
});

export const categoryTranslation = sqliteTable(
    "category_translation",
    {
        category_id: integer()
            .notNull()
            .references(() => category.id),
        locale: text().notNull(),
        name: text().notNull(),
    },
    (t) => [primaryKey({ columns: [t.category_id, t.locale] })]
);

export const food = sqliteTable(
    "food",
    {
        id: integer().primaryKey(),
        name: text().notNull(),
        category_id: integer()
            .notNull()
            .references(() => category.id),
        kcal_per_100g: integer().notNull(),
        fat_g_per_100g: real().notNull(),
        carbs_g_per_100g: real().notNull(),
        protein_g_per_100g: real().notNull(),
        info: text(),
        additional_info: text({ mode: "json" }).$type<Record<string, unknown>>(),
        updated_at: text().notNull(),
        is_active: integer({ mode: "boolean" }).notNull().default(true),
    },
    (t) => [
        index("food_category_idx").on(t.category_id),
        index("food_updated_idx").on(t.updated_at),
    ]
);

export const foodTranslation = sqliteTable(
    "food_translation",
    {
        food_id: integer()
            .notNull()
            .references(() => food.id),
        locale: text().notNull(),
        name: text().notNull(),
        info: text(),
    },
    (t) => [primaryKey({ columns: [t.food_id, t.locale] })]
);

export const nutrient = sqliteTable("nutrient", {
    id: integer().primaryKey(),
    code: text().notNull().unique(),
    name: text().notNull(),
    unit: text({ enum: ["g", "mg", "ug"] }).notNull(),
    sort_order: integer().notNull().default(0),
});

export const foodNutrient = sqliteTable(
    "food_nutrient",
    {
        food_id: integer()
            .notNull()
            .references(() => food.id),
        nutrient_id: integer()
            .notNull()
            .references(() => nutrient.id),
        amount_per_100g: real().notNull(),
    },
    (t) => [primaryKey({ columns: [t.food_id, t.nutrient_id] })]
);

export const allergen = sqliteTable("allergen", {
    id: integer().primaryKey(),
    code: text().notNull().unique(),
    name: text().notNull(),
});

export const foodAllergen = sqliteTable(
    "food_allergen",
    {
        food_id: integer()
            .notNull()
            .references(() => food.id),
        allergen_id: integer()
            .notNull()
            .references(() => allergen.id),
    },
    (t) => [
        primaryKey({ columns: [t.food_id, t.allergen_id] }),
        index("food_allergen_allergen_idx").on(t.allergen_id),
    ]
);

export const mealType = sqliteTable("meal_type", {
    id: integer().primaryKey(),
    code: text().notNull().unique(),
    default_name: text().notNull(),
    default_icon: text().notNull(),
    default_start_time: text(),
    default_end_time: text(),
    sort_order: integer().notNull().default(0),
});

export const mealTypeTranslation = sqliteTable(
    "meal_type_translation",
    {
        meal_type_id: integer()
            .notNull()
            .references(() => mealType.id),
        locale: text().notNull(),
        name: text().notNull(),
    },
    (t) => [primaryKey({ columns: [t.meal_type_id, t.locale] })]
);

export const activityType = sqliteTable("activity_type", {
    id: integer().primaryKey(),
    name: text().notNull(),
    met: real().notNull(),
});
