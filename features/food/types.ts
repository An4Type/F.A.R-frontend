import type Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";

export type IconName = ComponentProps<typeof Ionicons>["name"];

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

export interface DayInfo {
    nutrition: Nutrition;
    foodConsumed: ConsumedFoodItem[];
    goal?: { nutrition: Nutrition };
}

export interface FoodRecognitionResult {
    name: string;
    canName: string;
}

export interface LogFoodInput {
    mass: number;
    foodCanName: string;
}

export interface Category {
    slug: string;
    label: string;
    icon: IconName;
}

export interface CategoryFood {
    slug: string;
    name: string;
    calories: number;
    icon: IconName;
}
