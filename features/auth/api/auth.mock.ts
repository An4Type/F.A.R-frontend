import type { AuthApi } from "@/features/auth/api/auth";
import { useAuthStore } from "@/features/auth/store/authStore";

// Signs in/registers instantly with no network call, so auth-gated screens
// are reachable without a live backend.
const delay = <T>(value: T, ms = 400): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const mockAuthApi: AuthApi = {
    loginRequest: async ({ email }) => {
        useAuthStore.getState().login("MOCK_TOKEN");
        return delay({ username: "MOCK_USER", token: "MOCK_TOKEN", email });
    },

    registerRequest: async ({ username, email }) => delay({ username, email, token: "MOCK_TOKEN" }),
};
