import type Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ComponentType } from "react";

export type IconName = ComponentProps<typeof Ionicons>["name"];

// Widget sizing type
export interface Span {
    w: number;
    h: number;
}

// Span extension type allowing to define label for sizing
export interface SpanOption extends Span {
    label?: string;
}

// Widget type that is persisted in memory of app
export interface WidgetInstance<Settings = any> {
    id: string;
    type: string;
    variant: string;
    span: Span;
    settings: Settings;
}

// Widget type that is used for updating state
export type WidgetPatch<Settings = any> = Partial<
    Pick<WidgetInstance<Settings>, "variant" | "span" | "settings">
>;

// What quick actions and settings sections both receive: the saved widget
// and its definition, read-only (shallow) — the definition is shared by
// every instance and the widget is a snapshot of the app's layout state, so
// changes go through each context's own update functions instead.
export interface WidgetContext<Settings = any> {
    readonly widget: Readonly<WidgetInstance<Settings>>;
    readonly widgetDefinition: Readonly<WidgetDefinition<any, Settings>>;
    // Spans a variant of this widget allows.
    spansFor: (variant: string) => SpanOption[];
}

// ---- Data sources --------------------------------------------------------

export interface SourceResult<Data> {
    data: Data;
    isLoading?: boolean;
    error?: unknown;
}

// A hook the board calls once per render. `active` is false when no placed
// widget reads this source, so it can skip fetching.
export type SourceHook<Data = any> = (options: { active: boolean }) => SourceResult<Data>;

export type SourceMap = Record<string, SourceHook>;

export type SourceData<Sources extends SourceMap> = {
    [K in keyof Sources]: ReturnType<Sources[K]>["data"];
};

// ---- Rendering -----------------------------------------------------------

// Widget type that is used by core for rendering
export interface WidgetViewProps<Data, Settings> {
    data: Data;
    settings: Settings;
    span: Span;
    // Measured size of the content area in px.
    frame: { width: number; height: number };
    editing: boolean;
    // True in the add-widget picker, where data is the definition's sample.
    preview: boolean;
}

export interface WidgetVariant<Data, Settings> {
    label: string;
    icon?: IconName;
    spans: SpanOption[];
    View: ComponentType<WidgetViewProps<Data, Settings>>;
}

// ---- Settings ------------------------------------------------------------

// Settings type that is used to save state before saving
export interface SettingsDraft<Settings> {
    variant: string;
    span: Span;
    settings: Settings;
}

// `widget` is the saved state; `draft` is what the section is editing and
// what the grid and spotlight preview. Nothing is saved until commit().
export interface SettingsSectionProps<Settings> extends WidgetContext<Settings> {
    // The current draft settings.
    draft: SettingsDraft<Settings>;
    updateDraft: (patch: WidgetPatch<Settings>) => void;
    updateDraftSettings: (patch: Partial<Settings>) => void;
    // Saves the draft, same as the host's Accept.
    commit: () => void;
    // Spans the draft's current variant allows.
    spans: SpanOption[];
    variants: { key: string; label: string; icon?: IconName }[];
}

// One page of a widget's settings. Widgets compose these from the engine's
// built-in sections and their own components.
export interface SettingsSection<Settings> {
    key: string;
    label: string;
    icon: IconName;
    Component: ComponentType<SettingsSectionProps<Settings>>;
}

// ---- Quick actions -------------------------------------------------------

// Unlike settings, quick actions change the layout immediately.
export interface QuickActionContext<Settings = any> extends WidgetContext<Settings> {
    update: (patch: WidgetPatch<Settings>) => void;
    openSettings: () => void;
    cycleSpan: () => void;
    remove: () => void;
}

// A button in the widget's header while the board is in edit mode.
export interface QuickAction<Settings = any> {
    key: string;
    icon: IconName;
    tone?: "default" | "danger";
    onPress: (context: QuickActionContext<Settings>) => void;
}

// ---- Definition ----------------------------------------------------------

// Widget definition type that defines widget that is supported by board
export interface WidgetDefinition<
    Data = any,
    Settings = any,
    Sources extends SourceMap = SourceMap,
> {
    type: string;
    label: string;
    icon: IconName;

    sources: (keyof Sources & string)[];
    select: (sources: SourceData<Sources>, settings: Settings) => Data;
    // Shown in the add-widget picker instead of live data.
    previewData: Data;

    defaultSettings: Settings;
    variants: Record<string, WidgetVariant<Data, Settings>>;
    defaultVariant: string;

    // Defaults to a single "Size" section.
    settingsSections?: SettingsSection<Settings>[];
    // Defaults to settings, cycle size, remove.
    quickActions?: QuickAction<Settings>[];
    // Tap on the widget outside edit mode.
    onPress?: (context: { widget: WidgetInstance<Settings>; data: Data }) => void;
}

// ---- Grid ----------------------------------------------------------------

export interface GridConfig {
    // A fixed count, or derived from the board's measured width.
    columns: number | ((width: number) => number);
    // Row height in px, or "square" to match the column width.
    rowHeight: number | "square";
    gap: number;
}
