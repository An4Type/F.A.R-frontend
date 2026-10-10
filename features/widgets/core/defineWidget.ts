import type { SourceMap, WidgetDefinition } from "@/features/widgets/core/types";

// Helper creation method that is used so the widgets that is created by return function
// can right inferred types from the source:
//   const defineAppWidget = defineWidget<typeof sources>();
//   export const water = defineAppWidget({ ... });
export function defineWidget<Sources extends SourceMap>() {
    return <Data, Settings>(definition: WidgetDefinition<Data, Settings, Sources>) => definition;
}
