import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedProps, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/theme";
import { useSweepIn } from "@/features/widget-catalog/shared/useSweepIn";
import { AddGlassButton, UndoGlassButton } from "@/features/widget-catalog/water/GlassButtons";
import type { WaterData, WaterSettings } from "@/features/widget-catalog/water/types";
import { sizeClass, type WidgetViewProps } from "@/features/widgets";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function WaterRingView({
    data,
    span,
    editing,
    preview,
}: WidgetViewProps<WaterData, WaterSettings>) {
    const { consumedMl, goalMl, glassMl, addWater } = data;
    const size = sizeClass(span);
    const large = size === "large";
    const interactive = !editing && !preview;
    const onAdd = interactive ? () => addWater(glassMl) : undefined;
    const onUndo = interactive && consumedMl > 0 ? () => addWater(-glassMl) : undefined;

    const shownMl = useSweepIn(consumedMl);
    const isOver = shownMl > goalMl;
    const pct = isOver ? 100 : goalMl > 0 ? Math.round((shownMl / goalMl) * 100) : 0;
    const ringSize = size === "small" ? 56 : size === "medium" ? 62 : 92;
    const stroke = large ? 9 : 7;
    const r = ringSize / 2 - stroke;
    const c = 2 * Math.PI * r;
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(c * (1 - pct / 100), { duration: 400 }),
    }));
    const glasses = Math.max(1, Math.round(goalMl / glassMl));
    const filled = Math.round(consumedMl / glassMl);
    const liters = (consumedMl / 1000).toFixed(1);

    return (
        <View className="min-h-0 flex-1 gap-[6px]">
            <View
                className={`min-h-0 flex-1 items-center justify-center ${large ? "flex-col gap-[6px]" : "flex-row gap-sm"}`}
            >
                <View className="relative" style={{ width: ringSize, height: ringSize }}>
                    {isOver ? (
                        <View
                            className={`absolute z-10 rounded-pill bg-macro-water-dark shadow-xs ${large ? "-right-[6px] -top-3xs px-[6px] py-[2.5px]" : "-right-[10px] -top-[6px] px-[5px] py-[2px]"}`}
                        >
                            <Text
                                className={`font-body-bold text-text-on-brand ${large ? "text-[9.5px]" : "text-[8px]"}`}
                            >
                                +{((consumedMl - goalMl) / 1000).toFixed(1)}L
                            </Text>
                        </View>
                    ) : null}
                    <Svg width={ringSize} height={ringSize}>
                        <Circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={r}
                            fill="none"
                            stroke={colors.surface.pill}
                            strokeWidth={stroke}
                        />
                        <AnimatedCircle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={r}
                            fill="none"
                            stroke={isOver ? colors.macro["water-dark"] : colors.macro.water}
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={c}
                            animatedProps={animatedProps}
                            transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                        />
                    </Svg>
                    <View className="absolute inset-0 items-center justify-center">
                        <Text
                            className={`font-display-bold text-text-primary ${large ? "text-sm" : "text-[12.5px]"}`}
                        >
                            {liters}L
                        </Text>
                        {size !== "small" ? (
                            <Text className="font-body text-[9px] text-text-tertiary">
                                of {(goalMl / 1000).toFixed(1)}L
                            </Text>
                        ) : null}
                    </View>
                </View>

                {size === "medium" ? (
                    <View className="items-center gap-[6px]">
                        <AddGlassButton label="+ Glass" onPress={onAdd} />
                        {onUndo ? (
                            <Pressable onPress={onUndo}>
                                <Text className="font-body text-[11px] text-text-tertiary">
                                    − undo
                                </Text>
                            </Pressable>
                        ) : null}
                    </View>
                ) : null}
            </View>

            {large ? (
                <>
                    <View className="flex-row flex-wrap justify-center gap-[5px]">
                        {Array.from({ length: glasses }).map((_, i) => (
                            <Ionicons
                                key={i}
                                name={i < filled ? "water" : "water-outline"}
                                size={15}
                                color={i < filled ? colors.macro.water : colors.gray[300]}
                            />
                        ))}
                    </View>
                    <View className="flex-row items-center justify-center gap-2xs">
                        {onUndo ? <UndoGlassButton size={30} onPress={onUndo} /> : null}
                        <AddGlassButton label={`+ Add glass (${glassMl}ml)`} onPress={onAdd} />
                    </View>
                </>
            ) : null}
        </View>
    );
}
