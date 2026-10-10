import { useQuery } from "@tanstack/react-query";
import { getCategoryFoods } from "@/features/food/api";

export function useCategoryFoods(category: string) {
    return useQuery({
        queryKey: ["categoryFoods", category],
        queryFn: () => getCategoryFoods(category),
        enabled: Boolean(category),
    });
}
