import { Text, View } from "react-native";
import Animated, { useAnimatedProps, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/theme";
import { NUTRIENT_COLORS } from "@/features/food/constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MacroCol {
    label: string;
    value: number;
    goal: number;
    color: string;
    colorDark: string;
}

interface MacroStatBarProps {
    proteins?: number;
    carbs?: number;
    fat?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatGoal?: number;
}

const R_MAIN = 30;
const STROKE_MAIN = 7;
const R_OVER = 40;
const STROKE_OVER = 4;
const SIZE = 96;
const C_MAIN = 2 * Math.PI * R_MAIN;
const C_OVER = 2 * Math.PI * R_OVER;

function MacroRingColumn({ c }: { c: MacroCol }) {
    const rawPct = c.goal > 0 ? (c.value / c.goal) * 100 : 0;
    const mainPct = Math.min(100, rawPct);
    const overPct = Math.max(0, Math.min(100, rawPct - 100));
    const isOver = rawPct > 100;
    const overGrams = Math.max(0, Math.round(c.value - c.goal));

    const mainAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(C_MAIN * (1 - mainPct / 100), { duration: 400 }),
    }));
    const overAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(C_OVER * (1 - overPct / 100), { duration: 400 }),
    }));

    return (
        <View className="items-center gap-2xs">
            {isOver ? (
                <View
                    className="absolute -top-[2px] right-[2px] z-10 rounded-pill px-[5px] py-[2px] shadow-xs"
                    style={{ backgroundColor: c.colorDark }}
                >
                    <Text className="font-body-bold text-[9px] text-text-on-brand">
                        +{overGrams}g
                    </Text>
                </View>
            ) : null}
            <View className="h-[96px] w-[96px]">
                <Svg width={SIZE} height={SIZE}>
                    {isOver ? (
                        <Circle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={R_OVER}
                            fill="none"
                            stroke={colors.surface.pill}
                            strokeWidth={STROKE_OVER}
                        />
                    ) : null}
                    {isOver ? (
                        <AnimatedCircle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={R_OVER}
                            fill="none"
                            stroke={c.colorDark}
                            strokeWidth={STROKE_OVER}
                            strokeLinecap="round"
                            strokeDasharray={C_OVER}
                            animatedProps={overAnimatedProps}
                            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                        />
                    ) : null}
                    <Circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R_MAIN}
                        fill="none"
                        stroke={colors.surface.pill}
                        strokeWidth={STROKE_MAIN}
                    />
                    <AnimatedCircle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R_MAIN}
                        fill="none"
                        stroke={c.color}
                        strokeWidth={STROKE_MAIN}
                        strokeLinecap="round"
                        strokeDasharray={C_MAIN}
                        animatedProps={mainAnimatedProps}
                        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    />
                </Svg>
                <View className="absolute inset-0 items-center justify-center">
                    <Text className="font-display-bold text-xs leading-none text-text-primary">
                        {Math.round(c.value)}
                    </Text>
                    <Text className="font-body text-[9px] text-text-tertiary">/{c.goal}g</Text>
                </View>
            </View>
            <Text className="font-body-semibold text-2xs text-text-secondary">{c.label}</Text>
        </View>
    );
}

export function MacroStatBar({
    proteins = 0,
    carbs = 0,
    fat = 0,
    proteinGoal = 150,
    carbsGoal = 250,
    fatGoal = 70,
}: MacroStatBarProps) {
    const cols: MacroCol[] = [
        { label: "Carbs", value: carbs, goal: carbsGoal, ...NUTRIENT_COLORS.carbs },
        { label: "Protein", value: proteins, goal: proteinGoal, ...NUTRIENT_COLORS.protein },
        { label: "Fat", value: fat, goal: fatGoal, ...NUTRIENT_COLORS.fat },
    ];

    return (
        <View className="w-full flex-row items-start justify-between px-[6px]">
            {cols.map((c) => (
                <MacroRingColumn key={c.label} c={c} />
            ))}
        </View>
    );
}
