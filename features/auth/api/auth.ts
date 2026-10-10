import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";
import type { RegisterFormValues } from "@/features/auth/schemas/registerSchema";
import { useAuthStore } from "@/features/auth/store/authStore";
import { api } from "@/lib/api/client";

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
}

// interface uses zod schemas for type inference
export interface AuthApi {
    loginRequest: (values: LoginFormValues) => Promise<AuthResponse | void>;
    registerRequest: (values: RegisterFormValues) => Promise<AuthResponse | void>;
}

export const realAuthApi: AuthApi = {
    loginRequest: async ({ email, password }) => {
        try {
            const response = await api.post<AuthResponse>("/user/login", {
                usernameOrEmail: email,
                password,
            });
            useAuthStore.getState().login(response.data.token);
            return response.data;
        } catch (error: any) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
        }
    },

    registerRequest: async ({ username, email, password }) => {
        try {
            const response = await api.post<AuthResponse>("/user", { username, email, password });
            return response.data;
        } catch (error: any) {
            console.error("Register failed:", error.response ? error.response.data : error.message);
        }
    },
};
