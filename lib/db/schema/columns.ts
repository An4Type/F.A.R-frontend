import { sql, type SQL } from "drizzle-orm";
import { integer, text, type SQLiteColumn } from "drizzle-orm/sqlite-core";

// SQLite storage for the contract types in lib/contracts:
// - catalog IDs → INTEGER, user IDs (UUID) → TEXT
// - timestamps, dates and times → TEXT in ISO 8601 (sorts correctly as text)
// - numeric → REAL, booleans → INTEGER 0/1, JSON → TEXT
// Column keys equal the column names and the contract field names, so a
// selected row has the contract's shape without mapping.
//
// Foreign keys are declared for documentation and typing, but SQLite doesn't
// enforce them unless `PRAGMA foreign_keys = ON`, which stays off: sync can
// deliver a child row before its parent.

/** Columns every user-owned table carries for offline sync. */
export const syncColumns = {
    updated_at: text().notNull(),
    deleted_at: text(),
    version: integer().notNull().default(0),
    // Assigned by the server; null until the row has synced.
    server_seq: integer(),
};

/** Exactly one of two nullable columns is set. */
export function exactlyOne(a: SQLiteColumn, b: SQLiteColumn): SQL {
    return sql`(${a} IS NULL) <> (${b} IS NULL)`;
}

/** Both columns are set, or both are null. */
export function bothOrNeither(a: SQLiteColumn, b: SQLiteColumn): SQL {
    return sql`(${a} IS NULL) = (${b} IS NULL)`;
}
