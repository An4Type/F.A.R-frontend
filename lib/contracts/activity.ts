import * as z from "zod";
import { catalogId, kcal, syncFields, timestamp, uuid } from "@/lib/contracts/common";

export const activitySource = z.enum(["manual", "health_kit", "health_connect"]);
export type ActivitySource = z.infer<typeof activitySource>;

export const userActivity = z
    .object({
        id: uuid,
        user_id: uuid,
        activity_type_id: catalogId.nullable(),
        name: z.string().min(1),
        started_at: timestamp,
        duration_min: z.int().positive(),
        kcal_burned: kcal,
        source: activitySource,
        // ID taken from the external health API/platform so on reimport don't duplicate data.
        external_id: z.string().min(1).nullable(),
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        // custom validation that runs after main and checks wether the imported data
        // has external_id
        if ((value.source === "manual") !== (value.external_id === null)) {
            ctx.addIssue({
                code: "custom",
                message: "external_id is set exactly for imported activities",
                path: ["external_id"],
            });
        }
    });
export type UserActivity = z.infer<typeof userActivity>;

export const bodyMeasurement = z
    .object({
        id: uuid,
        user_id: uuid,
        measured_at: timestamp,
        weight_kg: z.number().positive().nullable(),
        height_cm: z.number().positive().nullable(),
        body_fat_pct: z.number().min(0).max(100).nullable(),
        ...syncFields,
    })
    .superRefine((value, ctx) => {
        if (value.weight_kg === null && value.height_cm === null && value.body_fat_pct === null) {
            ctx.addIssue({
                code: "custom",
                message: "At least one measurement must be set",
                path: ["weight_kg"],
            });
        }
    });
export type BodyMeasurement = z.infer<typeof bodyMeasurement>;
