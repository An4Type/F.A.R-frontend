import { CameraCapturedPicture } from "expo-camera";
import FormData from "form-data";
import { Platform } from "react-native";
import { api } from "@/lib/api/client";
import type { DayInfo, FoodRecognitionResult, LogFoodInput } from "@/features/food/types";

export interface FoodApi {
    getFoodByPhoto: (
        photo: CameraCapturedPicture
    ) => Promise<{ food: FoodRecognitionResult; uri: string }>;
    getFoodList: () => Promise<DayInfo[]>;
    addFoodConsumedLight: (input: LogFoodInput) => Promise<DayInfo>;
}

export const photoUri = (photo: CameraCapturedPicture) =>
    Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "");

export const realFoodApi: FoodApi = {
    getFoodByPhoto: async (photo) => {
        const uri = photoUri(photo);
        const formData = new FormData();
        formData.append("photo", {
            uri,
            name: `photo_${Date.now()}.jpg`,
            type: "image/jpeg",
        });

        const response = await api.post<FoodRecognitionResult>("/food/getFoodByPhoto", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return { food: response.data, uri };
    },

    getFoodList: async () => {
        const response = await api.get<DayInfo[]>("/day/getUserDayInfoListLight");
        return response.data;
    },

    addFoodConsumedLight: async (input) => {
        const response = await api.post<DayInfo>("/user/addFoodConsumedLight", input);
        return response.data;
    },
};
