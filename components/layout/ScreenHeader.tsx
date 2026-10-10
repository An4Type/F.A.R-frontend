import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps, type ReactNode } from "react";
import { Text, View } from "react-native";
import { IconButton } from "@/components/ui/IconButton";
import { colors } from "@/constants/theme";

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    titleIcon?: ComponentProps<typeof Ionicons>["name"];
    leading?: ReactNode;
    right?: ReactNode;
}

/**
 * Default simple header for simple screens, with possibility to add back action
 */
export function ScreenHeader({
    title,
    subtitle,
    onBack,
    titleIcon,
    leading,
    right,
}: ScreenHeaderProps) {
    return (
        <View className="flex-row items-center gap-md bg-surface-hero px-xl pb-2xl pt-xl">
            {onBack ? <IconButton icon="arrow-back" onPress={onBack} /> : null}
            {leading}
            <View className="min-w-0 flex-1">
                <View className="flex-row items-center gap-sm">
                    {titleIcon ? (
                        <Ionicons name={titleIcon} size={20} color={colors.text["on-brand"]} />
                    ) : null}
                    <Text
                        numberOfLines={1}
                        className={`shrink font-display-bold tracking-tight text-text-on-brand ${onBack ? "text-lg" : "text-xl"}`}
                    >
                        {title}
                    </Text>
                </View>
                {subtitle ? (
                    <Text className="mt-[2px] font-body text-2xs text-text-on-brand-muted">
                        {subtitle}
                    </Text>
                ) : null}
            </View>
            {right}
        </View>
    );
}
