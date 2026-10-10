import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps } from "react";
import { Pressable, Text } from "react-native";
import { colors } from "@/constants/theme";

interface CategoryTileProps {
    label: string;
    icon: ComponentProps<typeof Ionicons>["name"];
    onPress?: () => void;
}

export function CategoryTile({ label, icon, onPress }: CategoryTileProps) {
    return (
        <Pressable
            onPress={onPress}
            className="aspect-square flex-1 items-center justify-center gap-[6px] rounded-card bg-surface-card shadow-xs"
        >
            <Ionicons name={icon} size={24} color={colors.action.primary} />
            <Text className="font-body-medium text-2xs text-text-primary">{label}</Text>
        </Pressable>
    );
}
