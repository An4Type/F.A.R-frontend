import { useState } from "react";
import { spansFor } from "@/features/widgets/core/spans";
import type {
    SettingsDraft,
    SettingsSection,
    SettingsSectionProps,
    WidgetDefinition,
    WidgetInstance,
    WidgetPatch,
} from "@/features/widgets/core/types";
import { widgetContext } from "@/features/widgets/core/widgetContext";
import { DEFAULT_SETTINGS_SECTIONS } from "@/features/widgets/settings/sections";

// Only what the user did. `null` means "not yet": the render then falls back
// to values derived from the widget itself, so nothing here can go stale.
interface SessionState {
    widgetId: string;
    // Section picked in the chooser.
    sectionKey: string | null;
    // Edits made in the open section.
    draft: SettingsDraft<any> | null;
}

interface UseSettingsSessionOptions {
    layout: WidgetInstance[];
    definitionOf: (type: string) => WidgetDefinition | undefined;
    onCommit: (widgetId: string, draft: SettingsDraft<any>) => void;
}

const draftFromWidget = (widget: WidgetInstance): SettingsDraft<any> => ({
    variant: widget.variant,
    span: widget.span,
    settings: widget.settings,
});

// Hook that is used to control the flow of the settings apply process.
export function useSettingsSession({ layout, definitionOf, onCommit }: UseSettingsSessionOptions) {
    const [state, setState] = useState<SessionState | null>(null);

    const candidate = state ? layout.find((w) => w.id === state.widgetId) : undefined;
    const widgetDefinition = candidate ? definitionOf(candidate.type) : undefined;
    // Null when nothing is open, or the widget is gone / its type unregistered,
    // which closes the session on its own.
    const editedWidget = candidate && widgetDefinition ? candidate : null;
    const isOpen = editedWidget !== null;

    const sections: SettingsSection<any>[] =
        widgetDefinition?.settingsSections ?? DEFAULT_SETTINGS_SECTIONS;
    // With a single section there's nothing to choose, so it opens directly.
    const activeSectionKey = state?.sectionKey ?? (sections.length === 1 ? sections[0].key : null);
    const activeSection = isOpen
        ? (sections.find((s) => s.key === activeSectionKey) ?? null)
        : null;
    const stage: "choose" | "edit" = activeSection ? "edit" : "choose";
    const draft = state?.draft ?? (editedWidget ? draftFromWidget(editedWidget) : null);

    const open = (widgetId: string) => setState({ widgetId, sectionKey: null, draft: null });

    const close = () => setState(null);

    const chooseSection = (key: string) => setState((s) => s && { ...s, sectionKey: key });

    // Discards the open section's draft and returns to the chooser.
    const backToSections = () => setState((s) => s && { ...s, sectionKey: null, draft: null });

    const updateDraft = (patch: WidgetPatch) => {
        if (!draft) return;
        setState((s) => s && { ...s, draft: { ...(s.draft ?? draft), ...patch } });
    };

    const updateDraftSettings = (patch: Record<string, unknown>) => {
        if (!draft) return;
        setState((s) => {
            if (!s) return s;
            const base = s.draft ?? draft;
            return { ...s, draft: { ...base, settings: { ...base.settings, ...patch } } };
        });
    };

    const commit = () => {
        if (!state || !draft) return;
        onCommit(state.widgetId, draft);
        if (sections.length === 1) close();
        // A cleared draft falls back to the values just saved.
        else setState({ ...state, sectionKey: null, draft: null });
    };

    // Everything the open section needs, so any host (the built-in one or a
    // custom one) only has to render `<activeSection.Component {...sectionProps} />`.
    // (maybe remove spans and variants from here, since the section can get them from the definition)
    const sectionProps: SettingsSectionProps<any> | null =
        editedWidget && widgetDefinition && draft
            ? {
                  ...widgetContext(editedWidget, widgetDefinition),
                  draft,
                  updateDraft,
                  updateDraftSettings,
                  commit,
                  spans: spansFor(widgetDefinition, draft.variant),
                  variants: Object.entries(widgetDefinition.variants).map(([key, v]) => ({
                      key,
                      label: v.label,
                      icon: v.icon,
                  })),
              }
            : null;

    const isPreviewing = (widgetId: string) => stage === "edit" && editedWidget?.id === widgetId;

    return {
        isOpen,
        stage,
        draft,
        editedWidget,
        widgetDefinition,
        sections,
        activeSection,
        sectionProps,
        open,
        close,
        chooseSection,
        backToSections,
        updateDraft,
        updateDraftSettings,
        commit,
        // The widget with the open draft applied, for rendering and packing.
        withDraft: (widget: WidgetInstance): WidgetInstance =>
            isPreviewing(widget.id) && draft ? { ...widget, ...draft } : widget,
    };
}

export type SettingsSession = ReturnType<typeof useSettingsSession>;
