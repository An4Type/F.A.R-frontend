import { colors } from "@/constants/theme";
import type { Category, IconName } from "@/features/food/types";

export const MEAL_GROUP_ICONS: IconName[] = [
    "cafe-outline",
    "restaurant-outline",
    "moon-outline",
    "ice-cream-outline",
    "wine-outline",
    "pizza-outline",
    "fast-food-outline",
    "nutrition-outline",
];

export type Nutrient = "calories" | "carbs" | "protein" | "fat";

// Ring color, plus the darker shade used for the "over goal" ring and badge.
export const NUTRIENT_COLORS: Record<Nutrient, { color: string; colorDark: string }> = {
    calories: { color: colors.action.primary, colorDark: colors.action["primary-active"] },
    carbs: { color: colors.macro.carbs, colorDark: colors.macro["carbs-dark"] },
    protein: { color: colors.macro.protein, colorDark: colors.macro["protein-dark"] },
    fat: { color: colors.macro.fat, colorDark: colors.macro["fat-dark"] },
};

export const CATEGORIES: Category[] = [
    { slug: "meat", label: "Meat", icon: "restaurant-outline" },
    { slug: "seafood", label: "Seafood", icon: "fish-outline" },
    { slug: "vegetables", label: "Vegetables", icon: "leaf-outline" },
    { slug: "fruits", label: "Fruits", icon: "nutrition-outline" },
    { slug: "grains", label: "Grains", icon: "ellipse-outline" },
    { slug: "dairy", label: "Dairy", icon: "water-outline" },
    { slug: "bakery", label: "Bakery", icon: "pizza-outline" },
    { slug: "snacks", label: "Snacks", icon: "fast-food-outline" },
    { slug: "beverages", label: "Beverages", icon: "cafe-outline" },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
    CATEGORIES.find((category) => category.slug === slug);
