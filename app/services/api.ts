import axios from "axios";
import Constants from "expo-constants";
import FormData from "form-data";
import { CameraCapturedPicture } from "expo-camera";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
if (!apiUrl) {
    throw new Error(
        "Missing API_URL. Copy .env.example to .env, set API_URL, and restart the dev server."
    );
}

export const api = axios.create({
    baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && hadAuthHeader) {
            useAuthStore.getState().logout();
            router.replace("/LoginPage");
        }
        return Promise.reject(error);
    }
);

export interface Nutrition {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
}

export interface ConsumedFoodItem {
    food: { name: string; canName?: string };
    nutrition: Nutrition;
}

export interface Goal {
    nutrition: Nutrition;
}

export interface DayInfo {
    nutrition: Nutrition;
    foodConsumed: ConsumedFoodItem[];
    goal?: Goal;
}

export interface FoodRecognitionResult {
    name: string;
    canName: string;
}

interface FoodData {
    mass: number;
    foodCanName: string;
}

export const getFoodByPhoto = async (
    photo: CameraCapturedPicture
): Promise<{ food: FoodRecognitionResult; uri: string }> => {
    const formData = new FormData();

    const uri = Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "");
    formData.append("photo", {
        uri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
    });

    const response = await api.post<FoodRecognitionResult>("/food/getFoodByPhoto", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return { food: response.data, uri };
};

export const getFoodList = async (): Promise<DayInfo[]> => {
    const response = await api.get<DayInfo[]>("/day/getUserDayInfoListLight");
    return response.data;
};

export const addFoodConsumedLight = async (foodData: FoodData): Promise<DayInfo> => {
    const response = await api.post<DayInfo>("/user/addFoodConsumedLight", foodData);
    return response.data;
};
