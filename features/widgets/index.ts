// Widget engine: grid, packing, board, quick actions, settings host and
// picker. Knows nothing about the app's widgets — those are definitions
// passed to createWidgetSystem (see features/widget-catalog).

export type { WidgetBoardProps } from "@/features/widgets/board/WidgetBoard";
export {
    cycleSpanAction,
    DEFAULT_QUICK_ACTIONS,
    removeAction,
    settingsAction,
} from "@/features/widgets/board/quickActions";
export { createWidgetSystem } from "@/features/widgets/core/createWidgetSystem";
export { defineWidget } from "@/features/widgets/core/defineWidget";
export {
    sameSpan,
    sizeClass,
    spanLabel,
    type SizeClass,
    fitSpan,
} from "@/features/widgets/core/spans";
export type {
    GridConfig,
    IconName,
    QuickAction,
    QuickActionContext,
    SettingsDraft,
    SettingsSection,
    SettingsSectionProps,
    SourceHook,
    SourceMap,
    SourceResult,
    Span,
    SpanOption,
    WidgetContext,
    WidgetDefinition,
    WidgetInstance,
    WidgetPatch,
    WidgetVariant,
    WidgetViewProps,
} from "@/features/widgets/core/types";
export { LimitedMultiSelect } from "@/features/widgets/settings/blocks/LimitedMultiSelect";
export { NumberField } from "@/features/widgets/settings/blocks/NumberField";
export { OptionButton } from "@/features/widgets/settings/blocks/OptionButton";
export { PresetPicker } from "@/features/widgets/settings/blocks/PresetPicker";
export { SpanPicker } from "@/features/widgets/settings/blocks/SpanPicker";
export { VariantPicker } from "@/features/widgets/settings/blocks/VariantPicker";
export { spanSection, variantSection } from "@/features/widgets/settings/sections";
export type { SettingsSession } from "@/features/widgets/settings/useSettingsSession";
