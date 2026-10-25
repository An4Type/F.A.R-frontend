import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// The signed-in user. The device database holds a single user; signing out
// clears it.
export const appUser = sqliteTable("app_user", {
    id: text().primaryKey(),
    email: text().notNull(),
    created_at: text().notNull(),
});
