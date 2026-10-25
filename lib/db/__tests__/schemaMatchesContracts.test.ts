import { getTableColumns, type Table } from "drizzle-orm";
import type * as z from "zod";
import * as contracts from "@/lib/contracts";
import * as schema from "@/lib/db/schema";

// Every table's columns must be exactly its contract's fields, so a row read
// from SQLite, a sync payload and an API response stay the same shape.
const PAIRS: [string, Table, z.ZodObject][] = [
    ["category", schema.category, contracts.category],
    ["category_translation", schema.categoryTranslation, contracts.categoryTranslation],
    ["food", schema.food, contracts.food],
    ["food_translation", schema.foodTranslation, contracts.foodTranslation],
    ["nutrient", schema.nutrient, contracts.nutrient],
    ["food_nutrient", schema.foodNutrient, contracts.foodNutrient],
    ["allergen", schema.allergen, contracts.allergen],
    ["food_allergen", schema.foodAllergen, contracts.foodAllergen],
    ["meal_type", schema.mealType, contracts.mealType],
    ["meal_type_translation", schema.mealTypeTranslation, contracts.mealTypeTranslation],
    ["activity_type", schema.activityType, contracts.activityType],
    ["user_food", schema.userFood, contracts.userFood],
    ["user_food_ingredient", schema.userFoodIngredient, contracts.userFoodIngredient],
    ["user_food_nutrient", schema.userFoodNutrient, contracts.userFoodNutrient],
    ["user_food_allergen", schema.userFoodAllergen, contracts.userFoodAllergen],
    ["food_serving", schema.foodServing, contracts.foodServing],
    ["food_barcode", schema.foodBarcode, contracts.foodBarcode],
    ["meal_group", schema.mealGroup, contracts.mealGroup],
    ["saved_meal", schema.savedMeal, contracts.savedMeal],
    ["saved_meal_item", schema.savedMealItem, contracts.savedMealItem],
    ["log_entry", schema.logEntry, contracts.logEntry],
    ["water_log", schema.waterLog, contracts.waterLog],
    ["app_user", schema.appUser, contracts.appUser],
    ["user_goal", schema.userGoal, contracts.userGoal],
    ["user_preferences", schema.userPreferences, contracts.userPreferences],
    ["user_allergen", schema.userAllergen, contracts.userAllergen],
    ["user_food_preference", schema.userFoodPreference, contracts.userFoodPreference],
    ["reminder", schema.reminder, contracts.reminder],
    ["user_activity", schema.userActivity, contracts.userActivity],
    ["body_measurement", schema.bodyMeasurement, contracts.bodyMeasurement],
];

describe("database schema", () => {
    it.each(PAIRS)("%s matches its contract", (_name, table, contract) => {
        const columns = Object.keys(getTableColumns(table)).sort();
        const fields = Object.keys(contract.shape).sort();
        expect(columns).toEqual(fields);
    });
});
