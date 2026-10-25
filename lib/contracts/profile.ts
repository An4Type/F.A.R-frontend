import * as z from "zod";
import {
    catalogId,
    foodRefFields,
    grams,
    kcal,
    localDate,
    locale,
    refineFoodRef,
    syncFields,
    timeOfDay,
    timestamp,
    uuid,
} from "@/lib/contracts/common";

export const appUser = z.object({
    id: uuid,
    email: z.email(),
    created_at: timestamp,
});
export type AppUser = z.infer<typeof appUser>;

/** The goal for a day is the row with the latest `effective_from`.
 * When the goal is updated the before data is not wasted but archived in order
 * to give user possibility of reviewing past achieves.
 */
export const userGoal = z.object({
    id: uuid,
    user_id: uuid,
    effective_from: localDate,
    kcal,
    fat_g: grams,
    carbs_g: grams,
    protein_g: grams,
    water_ml: z.int().nonnegative(),
    ...syncFields,
});
export type UserGoal = z.infer<typeof userGoal>;

export const units = z.enum(["grams", "ounces"]);
export type Units = z.infer<typeof units>;

export const diet = z.enum(["none", "vegetarian", "vegan", "keto", "paleo"]);
export type Diet = z.infer<typeof diet>;

export const userPreferences = z.object({
    user_id: uuid,
    units,
    locale,
    // IANA zone, "Europe/Warsaw"; used to compute local_date.
    timezone: z.string().min(1),
    diet,
    // Free-text ingredients to avoid; not joined, so kept as a list.
    excluded_ingredients: z.array(z.string().min(1)),
    // Owned by the on-device widget system, so it is validated where it's used.
    dashboard_layout: z.unknown().nullable(),
    ...syncFields,
});
export type UserPreferences = z.infer<typeof userPreferences>;

export const userAllergen = z.object({
    user_id: uuid,
    allergen_id: catalogId,
    ...syncFields,
});
export type UserAllergen = z.infer<typeof userAllergen>;

export const foodPreferenceKind = z.enum(["favorite", "blocked"]);
export type FoodPreferenceKind = z.infer<typeof foodPreferenceKind>;

export const userFoodPreference = z
    .object({
        id: uuid,
        user_id: uuid,
        ...foodRefFields,
        kind: foodPreferenceKind,
        ...syncFields,
    })
    .superRefine(refineFoodRef);
export type UserFoodPreference = z.infer<typeof userFoodPreference>;

export const reminderKind = z.enum(["meal", "water", "weigh_in"]);
export type ReminderKind = z.infer<typeof reminderKind>;

/** Bit representation of selected days of week, Monday = 1 ... Sunday = 64;
 * 127 = every day. 2^7-1 variants
 */
export const daysOfWeek = z.int().min(1).max(127);

export const reminder = z
    .object({
        id: uuid,
        user_id: uuid,
        kind: reminderKind,
        meal_group_id: uuid.nullable(),
        time: timeOfDay,
        days_of_week: daysOfWeek,
        is_enabled: z.boolean(),
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        if ((value.kind === "meal") !== (value.meal_group_id !== null)) {
            ctx.addIssue({
                code: "custom",
                message: "meal_group_id is set exactly for meal reminders",
                path: ["meal_group_id"],
            });
        }
    });
export type Reminder = z.infer<typeof reminder>;
