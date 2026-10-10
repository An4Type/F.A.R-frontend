import { mockFoodApi } from "@/features/food/api/food.mock";
import { realFoodApi } from "@/features/food/api/food";
import { USE_MOCK_API } from "@/lib/env";

export const foodApi = USE_MOCK_API ? mockFoodApi : realFoodApi;
export { getCategoryFoods } from "@/features/food/api/catalog.mock";
