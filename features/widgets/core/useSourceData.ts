import type { SourceData, SourceMap } from "@/features/widgets/core/types";

export interface SourceState<Sources extends SourceMap> {
    data: SourceData<Sources>;
    status: Record<string, { isLoading: boolean; error?: unknown }>;
}

// Hook that fetches all sources using source map and hooks stored there
// Because the source map is fixed when the widget is created hooks is fired
// in the same order what is required by the hook rules
export function useSourceData<Sources extends SourceMap>(
    sources: Sources,
    activeKeys: Set<string>
): SourceState<Sources> {
    const data = {} as Record<string, unknown>;
    const status: SourceState<Sources>["status"] = {};
    for (const key of Object.keys(sources)) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const result = sources[key]({ active: activeKeys.has(key) });
        data[key] = result.data;
        status[key] = { isLoading: result.isLoading ?? false, error: result.error };
    }
    return { data: data as SourceData<Sources>, status };
}
