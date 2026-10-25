import { sql } from "drizzle-orm";
import { check, index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { activityType } from "@/lib/db/schema/catalog";
import { syncColumns } from "@/lib/db/schema/columns";
import { appUser } from "@/lib/db/schema/user";

// Exercise and body measurements.

export const userActivity = sqliteTable(
    "user_activity",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        activity_type_id: integer().references(() => activityType.id),
        name: text().notNull(),
        started_at: text().notNull(),
        duration_min: integer().notNull(),
        kcal_burned: integer().notNull(),
        source: text({ enum: ["manual", "health_kit", "health_connect"] }).notNull(),
        external_id: text(),
        ...syncColumns,
    },
    (t) => [
        index("user_activity_started_idx").on(t.started_at),
        check(
            "user_activity_external_id",
            sql`(${t.source} = 'manual') = (${t.external_id} IS NULL)`
        ),
    ]
);

export const bodyMeasurement = sqliteTable(
    "body_measurement",
    {
        id: text().primaryKey(),
        user_id: text()
            .notNull()
            .references(() => appUser.id),
        measured_at: text().notNull(),
        weight_kg: real(),
        height_cm: real(),
        body_fat_pct: real(),
        ...syncColumns,
    },
    (t) => [
        index("body_measurement_measured_idx").on(t.measured_at),
        check(
            "body_measurement_any",
            sql`${t.weight_kg} IS NOT NULL OR ${t.height_cm} IS NOT NULL OR ${t.body_fat_pct} IS NOT NULL`
        ),
    ]
);
