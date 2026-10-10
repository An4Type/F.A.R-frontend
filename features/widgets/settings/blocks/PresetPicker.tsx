import { View } from "react-native";
import { OptionButton } from "@/features/widgets/settings/blocks/OptionButton";

interface PresetPickerProps<Value> {
    options: { label: string; caption?: string; value: Value }[];
    value: Value;
    onChange: (value: Value) => void;
}

export function PresetPicker<Value>({ options, value, onChange }: PresetPickerProps<Value>) {
    return (
        <View className="flex-row gap-2xs">
            {options.map((option) => (
                <OptionButton
                    key={option.label}
                    label={option.label}
                    caption={option.caption}
                    active={option.value === value}
                    onPress={() => onChange(option.value)}
                />
            ))}
        </View>
    );
}
