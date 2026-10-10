import { z } from "zod";
import { emailField, passwordField } from "@/features/auth/schemas/fields";

export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
