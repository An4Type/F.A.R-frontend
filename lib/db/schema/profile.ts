import { sql } from "drizzle-orm";
import {
    check,
    index,
    integer,
    primaryKey,
    real,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
import { allergen, food } from "@/lib/db/schema/catalog";
import { exactlyOne, syncColumns } from "@/lib/db/schema/columns";
import { mealGroup } from "@/lib/db/schema/diary";
import { appUser } from "@/lib/db/schema/user";
import { userFood } from "@/lib/db/schema/userFood";

// The user's goals, preferences and reminders.

export const userGoal = sqliteTable(
    "user_goal",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        effective_from: text().notNull(),
        kcal: integer().notNull(),
        fat_g: real().notNull(),
        carbs_g: real().notNull(),
        protein_g: real().notNull(),
        water_ml: integer().notNull(),
        ...syncColumns,
    },
    (t) => [index("user_goal_effective_idx").on(t.effective_from)]
);

export const userPreferences = sqliteTable("user_preferences", {
    user_id: text()
        .primaryKey()
        .references(() => appUser.id),
    units: text({ enum: ["grams", "ounces"] }).notNull(),
    locale: text().notNull(),
    timezone: text().notNull(),
    diet: text({ enum: ["none", "vegetarian", "vegan", "keto", "paleo"] }).notNull(),
    excluded_ingredients: text({ mode: "json" }).$type<string[]>().notNull(),
    dashboard_layout: text({ mode: "json" }).$type<unknown>(),
    ...syncColumns,
});

export const userAllergen = sqliteTable(
    "user_allergen",
    {
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        allergen_id: integer()
            .notNull()
            .references(() => allergen.id),
        ...syncColumns,
    },
    (t) => [primaryKey({ columns: [t.user_id, t.allergen_id] })]
);

export const userFoodPreference = sqliteTable(
    "user_food_preference",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        food_id: integer().references(() => food.id),
        user_food_id: text().references(() => userFood.id),
        kind: text({ enum: ["favorite", "blocked"] }).notNull(),
        ...syncColumns,
    },
    (t) => [check("user_food_preference_food_ref", exactlyOne(t.food_id, t.user_food_id))]
);

export const reminder = sqliteTable(
    "reminder",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        kind: text({ enum: ["meal", "water", "weigh_in"] }).notNull(),
        meal_group_id: text().references(() => mealGroup.id),
        time: text().notNull(),
        // Bit per weekday, Monday = 1 ... Sunday = 64.
        days_of_week: integer().notNull(),
        is_enabled: integer({ mode: "boolean" }).notNull().default(true),
        ...syncColumns,
    },
    (t) => [
        check("reminder_meal_group", sql`(${t.kind} = 'meal') = (${t.meal_group_id} IS NOT NULL)`),
        check("reminder_days", sql`${t.days_of_week} BETWEEN 1 AND 127`),
    ]
);
