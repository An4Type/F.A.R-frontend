import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import Animated, { useAnimatedProps, withTiming } from "react-native-reanimated";
import Svg, { ClipPath, Defs, Rect } from "react-native-svg";
import { colors } from "@/constants/theme";
import { useSweepIn } from "@/features/widget-catalog/shared/useSweepIn";
import { AddGlassButton, UndoGlassButton } from "@/features/widget-catalog/water/GlassButtons";
import type { WaterData, WaterSettings } from "@/features/widget-catalog/water/types";
import type { WidgetViewProps } from "@/features/widgets";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Bottle silhouette in a 60x130 viewBox: neck (22,0,16,16) + rounded body
// (6,16,48,100,rx14). The liquid rect is clipped to it and rises with the
// fill percentage.
const BODY_BOTTOM = 114;

export function WaterBottleView({
    data,
    editing,
    preview,
}: WidgetViewProps<WaterData, WaterSettings>) {
    const { consumedMl, goalMl, glassMl, addWater } = data;
    const interactive = !editing && !preview;

    const shownMl = useSweepIn(consumedMl);
    const isOver = shownMl > goalMl;
    const pct = isOver ? 100 : goalMl > 0 ? Math.round((shownMl / goalMl) * 100) : 0;
    const liquidTop = Math.max(14, BODY_BOTTOM - (pct / 100) * (BODY_BOTTOM - 16));
    const animatedProps = useAnimatedProps(() => ({
        y: withTiming(liquidTop, { duration: 500 }),
        height: withTiming(130 - liquidTop, { duration: 500 }),
    }));
    const glasses = Math.max(1, Math.round(goalMl / glassMl));
    const filled = Math.round(consumedMl / glassMl);

    return (
        <View className="min-h-0 flex-1 items-center justify-center gap-2xs">
            <View className="h-[130px] w-[60px]">
                <Svg width={60} height={130} viewBox="0 0 60 130">
                    <Defs>
                        <ClipPath id="am-bottle-clip">
                            <Rect x={22} y={0} width={16} height={16} />
                            <Rect x={6} y={16} width={48} height={100} rx={14} />
                        </ClipPath>
                    </Defs>
                    <Rect
                        x={0}
                        y={0}
                        width={60}
                        height={160}
                        fill={colors.surface.subtle}
                        clipPath="url(#am-bottle-clip)"
                    />
                    <AnimatedRect
                        x={0}
                        width={60}
                        fill={isOver ? colors.macro["water-dark"] : colors.macro.water}
                        clipPath="url(#am-bottle-clip)"
                        animatedProps={animatedProps}
                    />
                    <Rect
                        x={22}
                        y={1}
                        width={16}
                        height={15.5}
                        rx={2}
                        fill="none"
                        stroke={colors.macro.water}
                        strokeWidth={2}
                    />
                    <Rect
                        x={6}
                        y={16}
                        width={48}
                        height={100}
                        rx={14}
                        fill="none"
                        stroke={colors.macro.water}
                        strokeWidth={2.5}
                    />
                </Svg>
                <View className="absolute inset-x-0 top-4xl items-center" pointerEvents="none">
                    <Text
                        className={`font-display-bold text-xs ${pct > 70 ? "text-text-on-brand" : "text-text-primary"}`}
                    >
                        {(consumedMl / 1000).toFixed(1)}L
                    </Text>
                    <Text
                        className={`font-body text-[8.5px] ${pct > 40 ? "text-white/85" : "text-text-tertiary"}`}
                    >
                        of {(goalMl / 1000).toFixed(1)}L
                    </Text>
                </View>
            </View>
            <View className="max-w-[90px] flex-row flex-wrap justify-center gap-[3px]">
                {Array.from({ length: glasses }).map((_, i) => (
                    <Ionicons
                        key={i}
                        name={i < filled ? "water" : "water-outline"}
                        size={12}
                        color={i < filled ? colors.macro.water : colors.gray[300]}
                    />
                ))}
            </View>
            <View className="flex-row items-center gap-2xs">
                {interactive && consumedMl > 0 ? (
                    <UndoGlassButton size={26} onPress={() => addWater(-glassMl)} />
                ) : null}
                <AddGlassButton
                    label="+ Glass"
                    onPress={interactive ? () => addWater(glassMl) : undefined}
                />
            </View>
        </View>
    );
}
