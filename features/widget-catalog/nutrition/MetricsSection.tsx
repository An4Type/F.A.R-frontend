import type { Nutrient } from "@/features/food";
import { maxRingsFor, type NutritionSettings } from "@/features/widget-catalog/nutrition/types";
import {
    LimitedMultiSelect,
    type SettingsSection,
    type SettingsSectionProps,
} from "@/features/widgets";

const METRIC_OPTIONS: { key: Nutrient; label: string }[] = [
    { key: "calories", label: "Calories" },
    { key: "carbs", label: "Carbs" },
    { key: "protein", label: "Protein" },
    { key: "fat", label: "Fat" },
];

function MetricsSettings({ draft, updateDraftSettings }: SettingsSectionProps<NutritionSettings>) {
    const max = maxRingsFor(draft.span);
    return (
        <LimitedMultiSelect
            options={METRIC_OPTIONS}
            value={draft.settings.metrics.slice(0, max)}
            max={max}
            onChange={(metrics) => updateDraftSettings({ metrics })}
            hint={(n) => `Pick up to ${n} ring${n > 1 ? "s" : ""} to show`}
        />
    );
}

export const metricsSection: SettingsSection<NutritionSettings> = {
    key: "metrics",
    label: "Metrics",
    icon: "nutrition-outline",
    Component: MetricsSettings,
};
