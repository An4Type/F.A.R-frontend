import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth";
import { foodApi } from "@/features/food/api";

export const dayInfoQueryKey = ["dayInfoList"] as const;

export function useDayInfoQuery({ enabled = true }: { enabled?: boolean } = {}) {
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return useQuery({
        queryKey: dayInfoQueryKey,
        queryFn: foodApi.getFoodList,
        enabled: enabled && hasHydrated && isAuthenticated,
    });
}
