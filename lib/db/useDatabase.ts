import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "@/lib/db/client";
import migrations from "@/lib/db/migrations/migrations";

/**
 * Brings the device database up to the current schema. Call once at the app
 * root and wait for `ready` before reading or writing data.
 */
export function useDatabase() {
    const { success, error } = useMigrations(db, migrations);
    return { ready: success, error };
}
