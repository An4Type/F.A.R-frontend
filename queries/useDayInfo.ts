import { useQuery } from "@tanstack/react-query";
import { getFoodList } from "@/app/services/api";
import { useAuthStore } from "@/store/authStore";

export const dayInfoQueryKey = ["dayInfoList"] as const;

export function useDayInfoQuery() {
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return useQuery({
        queryKey: dayInfoQueryKey,
        queryFn: getFoodList,
        enabled: hasHydrated && isAuthenticated,
    });
}
