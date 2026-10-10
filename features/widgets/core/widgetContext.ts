import { spansFor } from "@/features/widgets/core/spans";
import type {
    WidgetContext,
    WidgetDefinition,
    WidgetInstance,
} from "@/features/widgets/core/types";

// Helper function for creation of context using only widget and definition
export function widgetContext<Settings>(
    widget: WidgetInstance<Settings>,
    widgetDefinition: WidgetDefinition<any, Settings>
): WidgetContext<Settings> {
    return {
        widget,
        widgetDefinition,
        spansFor: (variant) => spansFor(widgetDefinition, variant),
    };
}
