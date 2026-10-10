import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text } from "react-native";
import { colors } from "@/constants/theme";
import type { IconName } from "@/features/widgets/core/types";

interface OptionButtonProps {
    label: string;
    caption?: string;
    icon?: IconName;
    active: boolean;
    onPress: () => void;
}

// A selectable tile; lay several out in a row as a single-choice picker.
export function OptionButton({ label, caption, icon, active, onPress }: OptionButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 items-center gap-3xs rounded-card border-[1.5px] py-sm ${active ? "border-action-primary bg-action-primary-tint" : "border-transparent bg-surface-subtle"}`}
        >
            {icon ? (
                <Ionicons
                    name={icon}
                    size={18}
                    color={active ? colors.action.primary : colors.text.secondary}
                />
            ) : null}
            <Text
                className={`font-body-semibold text-2xs ${active ? "text-action-primary" : "text-text-primary"}`}
            >
                {label}
            </Text>
            {caption ? (
                <Text className="font-body text-[10.5px] text-text-tertiary">{caption}</Text>
            ) : null}
        </Pressable>
    );
}
