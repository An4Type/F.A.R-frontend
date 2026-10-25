import * as z from "zod";
import {
    catalogId,
    foodRefFields,
    grams,
    kcal,
    localDate,
    refineFoodRef,
    syncFields,
    timeOfDay,
    timestamp,
    uuid,
} from "./common";

/**
 * Refine function that validates so both serving_id, serving_count must be defined or null
 **/
function refineServing(
    value: { serving_id: string | null; serving_count: number | null },
    ctx: z.RefinementCtx
) {
    if ((value.serving_id === null) !== (value.serving_count === null)) {
        ctx.addIssue({
            code: "custom",
            message: "serving_id and serving_count must be set together",
            path: ["serving_count"],
        });
    }
}

const servingFields = {
    serving_id: uuid.nullable(),
    serving_count: z.number().positive().nullable(),
    quantity_g: z.number().positive(),
};

/**
 * The user's own meal groups. `meal_type_id` links a group created from a
 * suggestion the one defined on sever side (renaming keeps it);
 * null for a fully custom group.
 */
export const mealGroup = z
    .object({
        id: uuid,
        user_id: uuid,
        meal_type_id: catalogId.nullable(),
        name: z.string().min(1),
        icon: z.string().min(1),
        // Window used to preselect the group when logging new meal/food.
        start_time: timeOfDay.nullable(),
        end_time: timeOfDay.nullable(),
        target_kcal: kcal.nullable(),
        target_fat_g: grams.nullable(),
        target_carbs_g: grams.nullable(),
        target_protein_g: grams.nullable(),
        sort_order: z.int(),
        // Archived instead of deleted, so old entries keep their group.
        // Later can be cleaned up if no entry refers group.
        is_archived: z.boolean(),
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        if ((value.start_time === null) !== (value.end_time === null)) {
            ctx.addIssue({
                code: "custom",
                message: "start_time and end_time must be set together",
                path: ["end_time"],
            });
        }
    });
export type MealGroup = z.infer<typeof mealGroup>;

/** A set the user often logs together; logging it creates one entry per item. */
export const savedMeal = z.object({
    id: uuid,
    user_id: uuid,
    meal_group_id: uuid.nullable(),
    name: z.string().min(1),
    ...syncFields,
});
export type SavedMeal = z.infer<typeof savedMeal>;

export const savedMealItem = z
    .object({
        id: uuid,
        saved_meal_id: uuid,
        ...foodRefFields,
        ...servingFields,
        sort_order: z.int(),
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        refineFoodRef(value, ctx);
        refineServing(value, ctx);
    });
export type SavedMealItem = z.infer<typeof savedMealItem>;

// Currently it is planned to offer user logging meal/food by this sources
export const logSource = z.enum(["manual", "ai_photo", "barcode", "saved_meal"]);
export type LogSource = z.infer<typeof logSource>;

/**
 * One eaten food. The *_snapshot columns copy the food's name and the
 * nutrition for `quantity_g` at logging time, so later edits to the food
 * never change history.
 */
export const logEntry = z
    .object({
        id: uuid,
        user_id: uuid,
        ...foodRefFields,
        meal_group_id: uuid.nullable(),
        saved_meal_id: uuid.nullable(),
        ...servingFields,
        consumed_at: timestamp,
        // The user's calendar day, fixed at logging time (time zones move).
        local_date: localDate,
        source: logSource,
        ai_confidence: z.number().min(0).max(1).nullable(),
        name_snapshot: z.string().min(1),
        serving_label_snapshot: z.string().nullable(),
        kcal_snapshot: kcal,
        fat_g_snapshot: grams,
        carbs_g_snapshot: grams,
        protein_g_snapshot: grams,
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        refineFoodRef(value, ctx);
        refineServing(value, ctx);
        if ((value.source === "ai_photo") !== (value.ai_confidence !== null)) {
            ctx.addIssue({
                code: "custom",
                message: "ai_confidence is set exactly for ai_photo entries",
                path: ["ai_confidence"],
            });
        }
        if ((value.source === "saved_meal") !== (value.saved_meal_id !== null)) {
            ctx.addIssue({
                code: "custom",
                message: "saved_meal_id is set exactly for saved_meal entries",
                path: ["saved_meal_id"],
            });
        }
    });
export type LogEntry = z.infer<typeof logEntry>;

export const waterLog = z.object({
    id: uuid,
    user_id: uuid,
    amount_ml: z.int().positive(),
    logged_at: timestamp,
    local_date: localDate,
    ...syncFields,
});
export type WaterLog = z.infer<typeof waterLog>;
