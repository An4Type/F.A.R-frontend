import * as z from "zod";
import {
    catalogId,
    foodRefFields,
    grams,
    kcal,
    refineFoodRef,
    syncFields,
    uuid,
} from "@/lib/contracts/common";

// Foods a user adds or adjusts, and the lookups (servings, barcodes) that can
// be also redefined/added by user

const NUTRITION_FIELDS = [
    "name",
    "category_id",
    "kcal_per_100g",
    "fat_g_per_100g",
    "carbs_g_per_100g",
    "protein_g_per_100g",
] as const;

/**
 * One table used to define all kinds of food that user can define, so each row can be either
 * of three kinds:
 * - override: `base_food_id` set; null columns inherit from the catalog food
 * - own food: `base_food_id` null; name, category and nutrition required
 * - recipe: own food with `is_recipe`; nutrition calculated from
 *   `user_food_ingredient` and `recipe_yield_g`, stored on the row
 */
export const userFood = z
    .object({
        id: uuid,
        user_id: uuid,
        base_food_id: catalogId.nullable(),
        is_recipe: z.boolean(),
        // Total weight of the finished recipe, used to get per-100 g values.
        recipe_yield_g: z.number().positive().nullable(),
        name: z.string().min(1).nullable(),
        category_id: catalogId.nullable(),
        kcal_per_100g: kcal.nullable(),
        fat_g_per_100g: grams.nullable(),
        carbs_g_per_100g: grams.nullable(),
        protein_g_per_100g: grams.nullable(),
        info: z.string().nullable(),
        additional_info: z.record(z.string(), z.unknown()).nullable(),
        ...syncFields,
    })
    // Custom validation logic determined on kind of record it is now
    .superRefine((value, ctx) => {
        if (value.base_food_id === null) {
            for (const field of NUTRITION_FIELDS) {
                if (value[field] === null) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Required for a food that doesn't override a catalog food",
                        path: [field],
                    });
                }
            }
        }
        if (value.is_recipe && value.base_food_id !== null) {
            ctx.addIssue({
                code: "custom",
                message: "A recipe can't override a catalog food",
                path: ["is_recipe"],
            });
        }
        if (value.is_recipe !== (value.recipe_yield_g !== null)) {
            ctx.addIssue({
                code: "custom",
                message: "recipe_yield_g is set exactly when is_recipe is true",
                path: ["recipe_yield_g"],
            });
        }
    });
export type UserFood = z.infer<typeof userFood>;

/** One ingredient of a recipe: a catalog food or another user food. */
export const userFoodIngredient = z
    .object({
        id: uuid,
        user_food_id: uuid,
        food_id: catalogId.nullable(),
        ingredient_user_food_id: uuid.nullable(),
        quantity_g: z.number().positive(),
        sort_order: z.int(),
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        if ((value.food_id === null) === (value.ingredient_user_food_id === null)) {
            ctx.addIssue({
                code: "custom",
                message: "Exactly one of food_id and ingredient_user_food_id must be set",
                path: ["food_id"],
            });
        }
        if (value.ingredient_user_food_id === value.user_food_id) {
            ctx.addIssue({
                code: "custom",
                message: "A recipe can't contain itself",
                path: ["ingredient_user_food_id"],
            });
        }
    });
export type UserFoodIngredient = z.infer<typeof userFoodIngredient>;

export const userFoodNutrient = z.object({
    user_food_id: uuid,
    nutrient_id: catalogId,
    amount_per_100g: z.number().nonnegative(),
    ...syncFields,
});
export type UserFoodNutrient = z.infer<typeof userFoodNutrient>;

export const userFoodAllergen = z.object({
    user_food_id: uuid,
    allergen_id: catalogId,
    ...syncFields,
});
export type UserFoodAllergen = z.infer<typeof userFoodAllergen>;

/** A named portion ("1 slice"). `user_id` null = global, from the server. */
export const foodServing = z
    .object({
        id: uuid,
        user_id: uuid.nullable(),
        ...foodRefFields,
        label: z.string().min(1),
        grams: z.number().positive(),
        is_default: z.boolean(),
        ...syncFields,
    })
    .superRefine(refineFoodRef);
export type FoodServing = z.infer<typeof foodServing>;

export const barcodeSource = z.enum(["catalog", "open_food_facts", "user"]);
export type BarcodeSource = z.infer<typeof barcodeSource>;

/** `user_id` null = global mapping; a user's own mapping wins in lookups. */
export const foodBarcode = z
    .object({
        id: uuid,
        code: z.string().min(1),
        user_id: uuid.nullable(),
        ...foodRefFields,
        source: barcodeSource,
        ...syncFields,
    })
    .superRefine(refineFoodRef);
export type FoodBarcode = z.infer<typeof foodBarcode>;
