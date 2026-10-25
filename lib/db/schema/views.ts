import { integer, real, sqliteView, text } from "drizzle-orm/sqlite-core";

/**
 * The user's food list: catalog foods with overrides and translations applied,
 * plus the user's own foods and recipes. Created by the hand-written migration
 * 0001_user_food_view.sql, so it's declared `.existing()` here for typed
 * queries only.
 */
export const vUserFood = sqliteView("v_user_food", {
    food_id: integer(),
    user_food_id: text(),
    name: text().notNull(),
    category_id: integer().notNull(),
    kcal_per_100g: integer().notNull(),
    fat_g_per_100g: real().notNull(),
    carbs_g_per_100g: real().notNull(),
    protein_g_per_100g: real().notNull(),
    is_overridden: integer({ mode: "boolean" }).notNull(),
    is_recipe: integer({ mode: "boolean" }).notNull(),
}).existing();
