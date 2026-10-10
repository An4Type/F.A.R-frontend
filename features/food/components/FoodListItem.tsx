import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";

interface FoodListItemProps {
    name: string;
    cal: number;
    grams?: number;
    icon?: ComponentProps<typeof Ionicons>["name"];
    onPress?: () => void;
}

export function FoodListItem({
    name,
    cal,
    grams,
    icon = "restaurant-outline",
    onPress,
}: FoodListItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between gap-sm rounded-card bg-surface-card p-md shadow-xs"
        >
            <View className="min-w-0 flex-1 flex-row items-center gap-sm">
                <View className="h-[38px] w-[38px] items-center justify-center rounded-pill bg-action-primary-tint">
                    <Ionicons name={icon} size={18} color={colors.action["primary-active"]} />
                </View>
                <View className="min-w-0 flex-1">
                    <Text numberOfLines={1} className="font-body-medium text-sm text-text-primary">
                        {name}
                    </Text>
                    {grams != null ? (
                        <Text className="mt-[2px] font-body text-[12px] text-text-tertiary">
                            {grams} g
                        </Text>
                    ) : null}
                </View>
            </View>
            <Text className="font-body-bold text-sm text-text-primary">{cal} cal</Text>
        </Pressable>
    );
}
