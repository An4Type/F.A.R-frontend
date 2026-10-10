import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps } from "react";
import { Pressable } from "react-native";
import { colors } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface IconButtonProps {
    icon: IconName;
    onPress?: () => void;
    active?: boolean;
    size?: number;
    className?: string;
}

export function IconButton({
    icon,
    onPress,
    active = false,
    size = 18,
    className = "",
}: IconButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`h-[36px] w-[36px] items-center justify-center rounded-pill ${active ? "bg-surface-card" : "bg-white/20"} ${className}`}
        >
            <Ionicons
                name={icon}
                size={size}
                color={active ? colors.action.primary : colors.text["on-brand"]}
            />
        </Pressable>
    );
}
