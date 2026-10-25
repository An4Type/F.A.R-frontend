import * as z from "zod";

// Shared building blocks for the data contracts in this folder.

/** Integer ID of a server-owned "catalog" data */
export const catalogId = z.int().positive();

/** UUID of a user-owned row, generated on the device. */
export const uuid = z.uuid();

/** Instant in time, ISO 8601 with offset, "2026-10-21T08:15:00Z". */
export const timestamp = z.iso.datetime({ offset: true });

/** Calendar day in the user's time zone, "YYYY-MM-DD". */
export const localDate = z.iso.date();

/** Time of day, "HH:MM" or "HH:MM:SS". */
export const timeOfDay = z.iso.time();

/** Locale tag of a translation, e.g. "en", "pl", "pl-PL". */
export const locale = z.string().min(2).max(35);

/** Whole kilocalories, per 100 g or per entry. */
export const kcal = z.int().nonnegative();

/** Grams with up to two decimals */
export const grams = z.number().nonnegative();

/** Columns that every user-owned table carries for offline sync. */
export const syncFields = {
    updated_at: timestamp,
    // Soft delete: a deleted row stays as a tombstone so the deletion syncs.
    deleted_at: timestamp.nullable(),
    // Incremented on every write; compared first when resolving conflicts.
    version: z.int().nonnegative(),
    // Assigned by the server; absent on rows that haven't synced yet.
    server_seq: z.int().nonnegative().optional(),
};

/** A row that points at either a catalog food or a user food. */
export const foodRefFields = {
    food_id: catalogId.nullable(),
    user_food_id: uuid.nullable(),
};

/**
 * Function that validates so food is always have either food_id/user_food_id.
 * A function for zod refinement part.
 */
export function refineFoodRef<T extends { food_id: number | null; user_food_id: string | null }>(
    value: T,
    ctx: z.RefinementCtx
) {
    if ((value.food_id === null) === (value.user_food_id === null)) {
        ctx.addIssue({
            code: "custom",
            message: "Exactly one of food_id and user_food_id must be set",
            path: ["food_id"],
        });
    }
}
