import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colors } from "@/constants/theme";

interface ToastProps {
    message: string;
    visible: boolean;
    icon?: ComponentProps<typeof Ionicons>["name"];
    onDismiss?: () => void;
    duration?: number;
}

export function Toast({
    message,
    visible,
    icon = "checkmark-circle",
    onDismiss,
    duration = 2200,
}: ToastProps) {
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => onDismiss?.(), duration);
        return () => clearTimeout(timer);
    }, [visible, duration, onDismiss]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(visible ? 1 : 0, { duration: 260 }),
        transform: [{ translateY: withTiming(visible ? 0 : 40, { duration: 260 }) }],
    }));

    return (
        <View pointerEvents="none" className="absolute inset-x-md bottom-[78px] z-50 items-center">
            <Animated.View style={animatedStyle}>
                <View className="flex-row items-center gap-2xs rounded-pill bg-gray-900 px-lg py-sm shadow-lg">
                    <Ionicons name={icon} size={18} color={colors.green[300]} />
                    <Text className="font-body-medium text-sm text-text-on-brand">{message}</Text>
                </View>
            </Animated.View>
        </View>
    );
}
