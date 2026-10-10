import { Text, View } from "react-native";
import type { WaterSettings } from "@/features/widget-catalog/water/types";
import {
    NumberField,
    PresetPicker,
    type SettingsSection,
    type SettingsSectionProps,
} from "@/features/widgets";

const GLASS_PRESETS = [
    { label: "Glass", caption: "250ml", value: 250 },
    { label: "Cup", caption: "350ml", value: 350 },
    { label: "Bottle", caption: "500ml", value: 500 },
];

function WaterGoalSettings({ draft, updateDraftSettings }: SettingsSectionProps<WaterSettings>) {
    return (
        <View>
            <NumberField
                label="Daily goal (ml)"
                value={draft.settings.goalMl}
                min={250}
                onChange={(goalMl) => updateDraftSettings({ goalMl })}
            />
            <Text className="mb-2xs font-body-medium text-[12px] text-text-secondary">
                Vessel size
            </Text>
            <PresetPicker
                options={GLASS_PRESETS}
                value={draft.settings.glassMl}
                onChange={(glassMl) => updateDraftSettings({ glassMl })}
            />
        </View>
    );
}

export const waterGoalSection: SettingsSection<WaterSettings> = {
    key: "water",
    label: "Water",
    icon: "water-outline",
    Component: WaterGoalSettings,
};
