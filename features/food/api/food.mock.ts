import { photoUri, type FoodApi } from "@/features/food/api/food";
import type { DayInfo } from "@/features/food/types";

const delay = <T>(value: T, ms = 400): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(value), ms));

let mockDayInfo: DayInfo = {
    nutrition: { calories: 12500, proteins: 250, carbohydrates: 140, fats: 35 },
    foodConsumed: [
        {
            food: { name: "Grilled Chicken Breast" },
            nutrition: { calories: 320, proteins: 60, carbohydrates: 0, fats: 8 },
        },
        {
            food: { name: "Brown Rice" },
            nutrition: { calories: 215, proteins: 5, carbohydrates: 45, fats: 2 },
        },
    ],
    goal: { nutrition: { calories: 4500, proteins: 150, carbohydrates: 250, fats: 70 } },
};

export const mockFoodApi: FoodApi = {
    getFoodByPhoto: async (photo) =>
        delay({
            food: { name: "Grilled Chicken", canName: "grilled_chicken" },
            uri: photoUri(photo),
        }),

    getFoodList: async () => delay([mockDayInfo]),

    addFoodConsumedLight: async (input) => {
        const addedCalories = Math.round(input.mass * 1.65);
        mockDayInfo = {
            ...mockDayInfo,
            nutrition: {
                ...mockDayInfo.nutrition,
                calories: mockDayInfo.nutrition.calories + addedCalories,
            },
            foodConsumed: [
                ...mockDayInfo.foodConsumed,
                {
                    food: { name: input.foodCanName },
                    nutrition: { calories: addedCalories, proteins: 0, carbohydrates: 0, fats: 0 },
                },
            ],
        };
        return delay(mockDayInfo);
    },
};
