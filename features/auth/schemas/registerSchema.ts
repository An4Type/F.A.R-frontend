import { z } from "zod";
import { emailField, passwordField } from "@/features/auth/schemas/fields";

export const registerSchema = z.object({
    username: z.string().min(3, "At least 3 characters"),
    email: emailField,
    password: passwordField,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
