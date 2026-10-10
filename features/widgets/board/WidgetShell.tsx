import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/theme";
import type { IconName } from "@/features/widgets/core/types";

export interface ShellAction {
    key: string;
    icon: IconName;
    tone?: "default" | "danger";
    onPress: () => void;
}

interface WidgetShellProps {
    title: string;
    editing?: boolean;
    isDragOver?: boolean;
    // Pauses the wiggle while this widget is spotlighted in its settings.
    isConfiguring?: boolean;
    actions?: ShellAction[];
    children?: ReactNode;
}

export function WidgetShell({
    title,
    editing = false,
    isDragOver = false,
    isConfiguring = false,
    actions = [],
    children,
}: WidgetShellProps) {
    const wiggle = useSharedValue(0);

    useEffect(() => {
        if (editing && !isDragOver && !isConfiguring) {
            wiggle.value = -0.6;
            wiggle.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 175, easing: Easing.inOut(Easing.ease) }),
                    withTiming(-0.6, { duration: 175, easing: Easing.inOut(Easing.ease) })
                ),
                -1
            );
        } else {
            cancelAnimation(wiggle);
            wiggle.value = withTiming(0, { duration: 100 });
        }
    }, [editing, isDragOver, isConfiguring, wiggle]);

    const wiggleStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${wiggle.value}deg` }],
    }));

    return (
        <Animated.View style={[{ width: "100%", height: "100%" }, wiggleStyle]}>
            <Card
                className={`h-full w-full gap-2xs ${isDragOver ? "opacity-60" : ""} ${editing ? "border-[1.5px] border-dashed border-gray-300" : ""}`}
            >
                <View className="flex-row items-center justify-between gap-2xs">
                    <View className="flex-1 flex-row items-center gap-2xs">
                        {editing ? (
                            <Ionicons
                                name="reorder-three-outline"
                                size={16}
                                color={colors.text.tertiary}
                            />
                        ) : null}
                        <Text
                            numberOfLines={1}
                            className="flex-1 font-body-bold text-[11px] uppercase tracking-[0.3px] text-text-tertiary"
                        >
                            {title}
                        </Text>
                    </View>
                    {editing && actions.length > 0 ? (
                        <View className="flex-row gap-3xs">
                            {actions.map((action) => (
                                <ActionButton
                                    key={action.key}
                                    icon={action.icon}
                                    tone={action.tone}
                                    onPress={action.onPress}
                                />
                            ))}
                        </View>
                    ) : null}
                </View>
                <View className="min-h-0 flex-1">{children}</View>
            </Card>
        </Animated.View>
    );
}

function ActionButton({ icon, tone = "default", onPress }: Omit<ShellAction, "key">) {
    const danger = tone === "danger";
    return (
        <Pressable
            onPress={onPress}
            className={`h-[22px] w-[22px] items-center justify-center rounded-pill ${danger ? "bg-action-danger" : "bg-black/[0.06]"}`}
        >
            <Ionicons
                name={icon}
                size={danger ? 13 : 12}
                color={danger ? colors.text["on-brand"] : colors.text.secondary}
            />
        </Pressable>
    );
}
