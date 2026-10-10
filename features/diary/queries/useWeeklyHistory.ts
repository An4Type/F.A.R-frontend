import { useQuery } from "@tanstack/react-query";
import { getWeeklyHistory } from "@/features/diary/api/history.mock";

export const weeklyHistoryQueryKey = ["weeklyHistory"] as const;

export function useWeeklyHistory({ enabled = true }: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: weeklyHistoryQueryKey,
        queryFn: getWeeklyHistory,
        enabled,
    });
}
