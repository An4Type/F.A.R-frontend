// Stands in for a category-browsing endpoint the real backend doesn't have
// yet. Called the same way as the real API (async, returns a Promise), so
// swapping in a real endpoint later is a one-line queryFn change.

import type { CategoryFood, IconName } from "@/features/food/types";

const delay = <T>(value: T): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(value), 300));

const slugify = (name: string): string =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const food = (name: string, calories: number, icon: IconName): CategoryFood => ({
    slug: slugify(name),
    name,
    calories,
    icon,
});

const CATEGORY_FOODS: Record<string, CategoryFood[]> = {
    Meat: [
        food("Grilled Chicken Breast", 165, "restaurant-outline"),
        food("Beef Sirloin Steak", 206, "restaurant-outline"),
        food("Turkey Slices", 104, "restaurant-outline"),
    ],
    Seafood: [
        food("Grilled Salmon", 208, "fish-outline"),
        food("Shrimp Skewers", 99, "fish-outline"),
    ],
    Vegetables: [
        food("Steamed Broccoli", 55, "leaf-outline"),
        food("Roasted Carrots", 60, "leaf-outline"),
        food("Spinach Salad", 23, "leaf-outline"),
    ],
    Fruits: [
        food("Banana", 105, "nutrition-outline"),
        food("Blueberries (1 cup)", 84, "nutrition-outline"),
    ],
    Grains: [
        food("Brown Rice (1 cup)", 216, "ellipse-outline"),
        food("Quinoa (1 cup)", 222, "ellipse-outline"),
    ],
    Dairy: [
        food("Greek Yogurt", 130, "water-outline"),
        food("Cheddar Cheese (1 oz)", 113, "water-outline"),
    ],
    Bakery: [
        food("Whole Wheat Bread (1 slice)", 81, "pizza-outline"),
        food("Bagel", 245, "pizza-outline"),
    ],
    Snacks: [
        food("Almonds (1 oz)", 164, "fast-food-outline"),
        food("Protein Bar", 200, "fast-food-outline"),
    ],
    Beverages: [
        food("Black Coffee", 2, "cafe-outline"),
        food("Orange Juice (1 cup)", 112, "cafe-outline"),
    ],
};

export const getCategoryFoods = (category: string): Promise<CategoryFood[]> =>
    delay(CATEGORY_FOODS[category] ?? []);
