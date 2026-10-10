import { z } from "zod";

// Field rules shared by the auth forms, so login and register can't drift.
export const emailField = z.email("Invalid email");
export const passwordField = z.string().min(8, "At least 8 characters");
