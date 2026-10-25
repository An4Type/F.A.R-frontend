import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "@/lib/db/schema";

// The on-device database: one file per install, holding the signed-in user's
// data and the downloaded catalog. `enableChangeListener` lets live queries
// (useLiveQuery) re-run when rows change.
const DATABASE_NAME = "anymeal.db";

export const sqlite = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

export const db = drizzle(sqlite, { schema });

export type Database = typeof db;
