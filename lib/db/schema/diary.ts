import { sql } from "drizzle-orm";
import { check, index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { food, mealType } from "@/lib/db/schema/catalog";
import { bothOrNeither, exactlyOne, syncColumns } from "@/lib/db/schema/columns";
import { appUser } from "@/lib/db/schema/user";
import { foodServing, userFood } from "@/lib/db/schema/userFood";

// What the user eats and drinks.

export const mealGroup = sqliteTable(
    "meal_group",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        // Set when created from a suggestion; renaming keeps it.
        meal_type_id: integer().references(() => mealType.id),
        name: text().notNull(),
        icon: text().notNull(),
        start_time: text(),
        end_time: text(),
        target_kcal: integer(),
        target_fat_g: real(),
        target_carbs_g: real(),
        target_protein_g: real(),
        sort_order: integer().notNull().default(0),
        is_archived: integer({ mode: "boolean" }).notNull().default(false),
        ...syncColumns,
    },
    (t) => [check("meal_group_window", bothOrNeither(t.start_time, t.end_time))]
);

export const savedMeal = sqliteTable("saved_meal", {
    id: text().primaryKey(),
    user_id: text()
        .notNull()
        .references(() => appUser.id),
    meal_group_id: text().references(() => mealGroup.id),
    name: text().notNull(),
    ...syncColumns,
});

export const savedMealItem = sqliteTable(
    "saved_meal_item",
    {
        id: text().primaryKey(),
        saved_meal_id: text()
            .notNull()
            .references(() => savedMeal.id),
        food_id: integer().references(() => food.id),
        user_food_id: text().references(() => userFood.id),
        serving_id: text().references(() => foodServing.id),
        serving_count: real(),
        quantity_g: real().notNull(),
        sort_order: integer().notNull().default(0),
        ...syncColumns,
    },
    (t) => [
        index("saved_meal_item_meal_idx").on(t.saved_meal_id),
        check("saved_meal_item_food_ref", exactlyOne(t.food_id, t.user_food_id)),
        check("saved_meal_item_serving", bothOrNeither(t.serving_id, t.serving_count)),
    ]
);

export const logEntry = sqliteTable(
    "log_entry",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        food_id: integer().references(() => food.id),
        user_food_id: text().references(() => userFood.id),
        meal_group_id: text().references(() => mealGroup.id),
        saved_meal_id: text().references(() => savedMeal.id),
        serving_id: text().references(() => foodServing.id),
        serving_count: real(),
        quantity_g: real().notNull(),
        consumed_at: text().notNull(),
        local_date: text().notNull(),
        source: text({ enum: ["manual", "ai_photo", "barcode", "saved_meal"] }).notNull(),
        ai_confidence: real(),
        // *_snapshot fields copied at logging time, so later food edits don't change history.
        name_snapshot: text().notNull(),
        serving_label_snapshot: text(),
        kcal_snapshot: integer().notNull(),
        fat_g_snapshot: real().notNull(),
        carbs_g_snapshot: real().notNull(),
        protein_g_snapshot: real().notNull(),
        ...syncColumns,
    },
    (t) => [
        // Daily totals, history and the diary all read by day.
        index("log_entry_local_date_idx").on(t.local_date),
        index("log_entry_meal_group_idx").on(t.meal_group_id),
        check("log_entry_food_ref", exactlyOne(t.food_id, t.user_food_id)),
        check("log_entry_serving", bothOrNeither(t.serving_id, t.serving_count)),
        check(
            "log_entry_ai_confidence",
            sql`(${t.source} = 'ai_photo') = (${t.ai_confidence} IS NOT NULL)`
        ),
        check(
            "log_entry_saved_meal",
            sql`(${t.source} = 'saved_meal') = (${t.saved_meal_id} IS NOT NULL)`
        ),
    ]
);

export const waterLog = sqliteTable(
    "water_log",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        amount_ml: integer().notNull(),
        logged_at: text().notNull(),
        local_date: text().notNull(),
        ...syncColumns,
    },
    (t) => [index("water_log_local_date_idx").on(t.local_date)]
);
