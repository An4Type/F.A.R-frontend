import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "TOKEN";

const TokenStorage = {
    loadToken:
        Platform.OS === "web"
            ? async () => localStorage.getItem(TOKEN_KEY)
            : async () => AsyncStorage.getItem(TOKEN_KEY),

    saveToken:
        Platform.OS === "web"
            ? async (token: string) => localStorage.setItem(TOKEN_KEY, token)
            : async (token: string) => AsyncStorage.setItem(TOKEN_KEY, token),

    deleteToken:
        Platform.OS === "web"
            ? async () => localStorage.removeItem(TOKEN_KEY)
            : async () => AsyncStorage.removeItem(TOKEN_KEY),
};

export default TokenStorage;
