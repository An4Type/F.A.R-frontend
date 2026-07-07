import axios from "axios";
import { router } from "expo-router";
import TokenStorage from "../services/tokenStorage";
import { localhost } from "./api";

interface User {
    username: string;
    email: string;
    password: string;
}

export const registerRequest = async (
    username: string,
    email: string,
    password: string
): Promise<User | void> => {
    try {
        const response = await axios.post(localhost + "/user", {
            username,
            email,
            password,
        });
        if (response.status === 201) {
            router.replace("../LoginPage", { relativeToDirectory: true });
        }
        console.log("Register successful:", response.data);
        return response.data; // Assuming response.data is of type User
    } catch (error: any) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
    }
};

export const loginRequest = async (
    usernameOrEmail: string,
    password: string
): Promise<User | void> => {
    try {
        const response = await axios.post(localhost + "/user/login", {
            usernameOrEmail,
            password,
        });
        if (response.status === 201) {
            router.replace("../.", { relativeToDirectory: true });
        }
        console.log("Login successful:", response.data);
        await TokenStorage.saveToken(response.data.token);
        return response.data; // Assuming response.data is of type User
    } catch (error: any) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
    }
};
