import type { AuthApi } from "@/features/auth/api/auth";
import { realAuthApi } from "@/features/auth/api/auth";
import { mockAuthApi } from "@/features/auth/api/auth.mock";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import { registerSchema } from "@/features/auth/schemas/registerSchema";
import { USE_MOCK_API } from "@/lib/env";

// Every request is checked against the same schemas the forms use, so a
// caller that skips the form can't send invalid input — for the real API
// and the mock alike. Throws a ZodError on invalid input.
const validated = (impl: AuthApi): AuthApi => ({
    loginRequest: (values) => impl.loginRequest(loginSchema.parse(values)),
    registerRequest: (values) => impl.registerRequest(registerSchema.parse(values)),
});

export const authApi = validated(USE_MOCK_API ? mockAuthApi : realAuthApi);
