import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/theme";

interface EmptyStateProps {
    icon?: ComponentProps<typeof Ionicons>["name"];
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
}

/**
 * Empty state component for screens with no content. Can optionally show an action button
 */
export function EmptyState({
    icon = "leaf-outline",
    title,
    subtitle,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <View className="items-center justify-center gap-[6px] px-2xl py-4xl">
            <View className="mb-2xs h-[64px] w-[64px] items-center justify-center rounded-pill bg-action-primary-tint">
                <Ionicons name={icon} size={30} color={colors.action.primary} />
            </View>
            <Text className="font-display-semibold text-[17px] text-text-primary">{title}</Text>
            {subtitle ? (
                <Text className="max-w-[240px] text-center font-body text-sm text-text-secondary">
                    {subtitle}
                </Text>
            ) : null}
            {actionLabel ? (
                <View className="mt-[14px]">
                    <Button onPress={onAction}>{actionLabel}</Button>
                </View>
            ) : null}
        </View>
    );
}
