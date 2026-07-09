import { router } from "expo-router";
import { api } from "./api";
import { useAuthStore } from "@/store/authStore";

interface AuthResponse {
    token: string;
    username: string;
    email: string;
}

export const registerRequest = async (
    username: string,
    email: string,
    password: string
): Promise<AuthResponse | void> => {
    try {
        const response = await api.post<AuthResponse>("/user", {
            username,
            email,
            password,
        });
        if (response.status === 201) {
            router.replace("../LoginPage", { relativeToDirectory: true });
        }
        console.log("Register successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
    }
};

export const loginRequest = async (
    usernameOrEmail: string,
    password: string
): Promise<AuthResponse | void> => {
    try {
        const response = await api.post<AuthResponse>("/user/login", {
            usernameOrEmail,
            password,
        });
        if (response.status === 201) {
            router.replace("../.", { relativeToDirectory: true });
        }
        console.log("Login successful:", response.data);
        useAuthStore.getState().login(response.data.token);
        return response.data;
    } catch (error: any) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
    }
};
