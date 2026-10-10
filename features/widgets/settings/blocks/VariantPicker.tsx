import { View } from "react-native";
import type { IconName } from "@/features/widgets/core/types";
import { OptionButton } from "@/features/widgets/settings/blocks/OptionButton";

interface VariantPickerProps {
    variants: { key: string; label: string; icon?: IconName }[];
    value: string;
    onChange: (variant: string) => void;
}

export function VariantPicker({ variants, value, onChange }: VariantPickerProps) {
    return (
        <View className="flex-row gap-2xs">
            {variants.map((variant) => (
                <OptionButton
                    key={variant.key}
                    label={variant.label}
                    icon={variant.icon}
                    active={variant.key === value}
                    onPress={() => onChange(variant.key)}
                />
            ))}
        </View>
    );
}
