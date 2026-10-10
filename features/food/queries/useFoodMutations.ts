import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foodApi } from "@/features/food/api";
import { dayInfoQueryKey } from "@/features/food/queries/useDayInfo";

export function useRecognizeFood() {
    return useMutation({ mutationFn: foodApi.getFoodByPhoto });
}

// Logs eaten food, then refreshes today's log everywhere it's shown using mutation invalidation
export function useLogFood() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: foodApi.addFoodConsumedLight,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: dayInfoQueryKey }),
    });
}
