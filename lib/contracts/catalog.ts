import * as z from "zod";
import { catalogId, grams, kcal, locale, timeOfDay, timestamp } from "@/lib/contracts/common";

// This file defines server-owned reference data. Read-only on the device.
// Is pulled up from the server.

export const category = z.object({
    id: catalogId,
    parent_id: catalogId.nullable(),
    slug: z.string().min(1),
    name: z.string().min(1),
    icon: z.string().min(1),
    sort_order: z.int(),
});
export type Category = z.infer<typeof category>;

export const categoryTranslation = z.object({
    category_id: catalogId,
    locale,
    name: z.string().min(1),
});
export type CategoryTranslation = z.infer<typeof categoryTranslation>;

export const food = z.object({
    id: catalogId,
    name: z.string().min(1),
    category_id: catalogId,
    kcal_per_100g: kcal,
    fat_g_per_100g: grams,
    carbs_g_per_100g: grams,
    protein_g_per_100g: grams,
    info: z.string().nullable(),
    additional_info: z.record(z.string(), z.unknown()).nullable(),
    updated_at: timestamp,
    is_active: z.boolean(),
});
export type Food = z.infer<typeof food>;

export const foodTranslation = z.object({
    food_id: catalogId,
    locale,
    name: z.string().min(1),
    info: z.string().nullable(),
});
export type FoodTranslation = z.infer<typeof foodTranslation>;

export const nutrientUnit = z.enum(["g", "mg", "ug"]);
export type NutrientUnit = z.infer<typeof nutrientUnit>;

export const nutrient = z.object({
    id: catalogId,
    code: z.string().min(1),
    name: z.string().min(1),
    unit: nutrientUnit,
    sort_order: z.int(),
});
export type Nutrient = z.infer<typeof nutrient>;

export const foodNutrient = z.object({
    food_id: catalogId,
    nutrient_id: catalogId,
    amount_per_100g: z.number().nonnegative(),
});
export type FoodNutrient = z.infer<typeof foodNutrient>;

export const allergen = z.object({
    id: catalogId,
    code: z.string().min(1),
    name: z.string().min(1),
});
export type Allergen = z.infer<typeof allergen>;

export const foodAllergen = z.object({
    food_id: catalogId,
    allergen_id: catalogId,
});
export type FoodAllergen = z.infer<typeof foodAllergen>;

export const mealType = z.object({
    id: catalogId,
    code: z.string().min(1),
    default_name: z.string().min(1),
    default_icon: z.string().min(1),
    default_start_time: timeOfDay.nullable(),
    default_end_time: timeOfDay.nullable(),
    sort_order: z.int(),
});
export type MealType = z.infer<typeof mealType>;

export const mealTypeTranslation = z.object({
    meal_type_id: catalogId,
    locale,
    name: z.string().min(1),
});
export type MealTypeTranslation = z.infer<typeof mealTypeTranslation>;

export const activityType = z.object({
    id: catalogId,
    name: z.string().min(1),
    // Metabolic equivalent; kcal = met * weight_kg * hours.
    met: z.number().positive(),
});
export type ActivityType = z.infer<typeof activityType>;
