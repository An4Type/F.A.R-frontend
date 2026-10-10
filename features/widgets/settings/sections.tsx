import { fitSpan } from "@/features/widgets/core/spans";
import type { SettingsSection } from "@/features/widgets/core/types";
import { SpanPicker } from "@/features/widgets/settings/blocks/SpanPicker";
import { VariantPicker } from "@/features/widgets/settings/blocks/VariantPicker";

// Built-in sections widgets can list in their settingsSections.

export const spanSection: SettingsSection<any> = {
    key: "size",
    label: "Size",
    icon: "resize-outline",
    Component: ({ draft, updateDraft, spans }) => (
        <SpanPicker spans={spans} value={draft.span} onChange={(span) => updateDraft({ span })} />
    ),
};

// Switching variant keeps the current span when the new variant allows it,
// otherwise snaps to that variant's first span.
export const variantSection: SettingsSection<any> = {
    key: "variant",
    label: "Display",
    icon: "color-palette-outline",
    Component: ({ draft, updateDraft, variants, spansFor }) => (
        <VariantPicker
            variants={variants}
            value={draft.variant}
            onChange={(variant) =>
                updateDraft({ variant, span: fitSpan(spansFor(variant), draft.span) })
            }
        />
    ),
};

export const DEFAULT_SETTINGS_SECTIONS = [spanSection];
