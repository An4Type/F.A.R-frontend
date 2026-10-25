import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Device-only tables: never synced themselves.

/**
 * Local writes waiting to be sent. A write and its outbox row are inserted in
 * the same transaction; rows are removed once the server accepts them.
 */
export const syncOutbox = sqliteTable(
    "sync_outbox",
    {
        id: text().primaryKey(),
        // Table name of the changed row, e.g. "log_entry".
        entity: text().notNull(),
        // Primary key of the changed row; composite keys joined with ":".
        // Uses uuid for newly created records for insertion in server
        entity_id: text().notNull(),
        op: text({ enum: ["upsert", "delete"] }).notNull(),
        payload: text({ mode: "json" }).$type<Record<string, unknown>>().notNull(),
        created_at: text().notNull(),
        attempts: integer().notNull().default(0),
    },
    (t) => [index("sync_outbox_created_idx").on(t.created_at)]
);

/** Sync cursors and similar bookkeeping, e.g. `user_cursor`, `catalog_cursor`.
 * Is used to remember what to what historic moment the data is load in device
 * to not sync historic data from start
 */
export const syncState = sqliteTable("sync_state", {
    key: text().primaryKey(),
    value: text().notNull(),
});
