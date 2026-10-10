import { Text, View } from "react-native";
import Animated, { useAnimatedProps, withDelay, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/theme";
import { NUTRIENT_COLORS, type Nutrient } from "@/features/food";
import {
    maxRingsFor,
    type NutritionData,
    type NutritionSettings,
} from "@/features/widget-catalog/nutrition/types";
import { useSweepIn } from "@/features/widget-catalog/shared/useSweepIn";
import { sizeClass, type WidgetViewProps } from "@/features/widgets";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_DURATION = 400;

interface MetricDef {
    label: string;
    unit: string;
    color: string;
    colorDark: string;
}

const METRIC_DEFS: Record<Nutrient, MetricDef> = {
    calories: { label: "Calories", unit: "cal", ...NUTRIENT_COLORS.calories },
    carbs: { label: "Carbs", unit: "g", ...NUTRIENT_COLORS.carbs },
    protein: { label: "Protein", unit: "g", ...NUTRIENT_COLORS.protein },
    fat: { label: "Fat", unit: "g", ...NUTRIENT_COLORS.fat },
};

interface RingDims {
    rMain: number;
    strokeMain: number;
    rOver: number;
    strokeOver: number;
    valueFont: number;
    labelFont: number;
    underLabelFont?: number;
    overLabelFont?: number;
    overBadgeLeft?: number;
    overBadgeTop?: number;
}

function Ring({
    def,
    value,
    goal,
    dims,
}: {
    def: MetricDef;
    value: number;
    goal: number;
    dims: RingDims;
}) {
    const {
        rMain,
        strokeMain,
        rOver,
        strokeOver,
        valueFont,
        labelFont,
        underLabelFont,
        overLabelFont,
        overBadgeLeft,
        overBadgeTop,
    } = dims;
    const cMain = 2 * Math.PI * rMain;
    const cOver = 2 * Math.PI * rOver;

    const shown = useSweepIn(value);

    const rawPct = goal > 0 ? (shown / goal) * 100 : 0;
    const mainPct = Math.min(100, rawPct);
    const overPct = Math.max(0, Math.min(100, rawPct - 100));
    const isOver = rawPct > 100;
    const overAmt = Math.max(0, Math.round(value - goal));

    const mainAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(cMain * (1 - mainPct / 100), { duration: RING_DURATION }),
    }));
    // The overflow ring only starts filling once the main ring's own sweep
    // has finished, so overflow reads as "the main ring topped out, and here's
    // how much further" rather than both rings filling at once.
    const overAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withDelay(
            RING_DURATION,
            withTiming(cOver * (1 - overPct / 100), { duration: RING_DURATION })
        ),
    }));

    const fitSize = (rOver + strokeOver) * 2;

    return (
        <View className="min-w-0 items-center gap-[6px]">
            <View className="relative" style={{ width: fitSize, height: fitSize }}>
                {isOver ? (
                    <View
                        className="absolute z-10 rounded-pill px-[5px] py-[2px] shadow-xs"
                        style={{
                            top: overBadgeTop ?? -4,
                            backgroundColor: def.colorDark,
                            left: "100%",
                            marginLeft: overBadgeLeft ?? -30,
                        }}
                    >
                        <Text
                            className="font-body-bold text-text-on-brand"
                            style={{ fontSize: overLabelFont ?? 8 }}
                        >
                            +{overAmt}
                            {def.unit === "cal" ? "" : def.unit}
                        </Text>
                    </View>
                ) : null}
                <Svg width={fitSize} height={fitSize}>
                    {isOver ? (
                        <Circle
                            cx={fitSize / 2}
                            cy={fitSize / 2}
                            r={rOver}
                            fill="none"
                            stroke={colors.surface.pill}
                            strokeWidth={strokeOver}
                        />
                    ) : null}
                    {isOver ? (
                        <AnimatedCircle
                            cx={fitSize / 2}
                            cy={fitSize / 2}
                            r={rOver}
                            fill="none"
                            stroke={def.colorDark}
                            strokeWidth={strokeOver}
                            strokeLinecap="round"
                            strokeDasharray={cOver}
                            animatedProps={overAnimatedProps}
                            transform={`rotate(-90 ${fitSize / 2} ${fitSize / 2})`}
                        />
                    ) : null}
                    <Circle
                        cx={fitSize / 2}
                        cy={fitSize / 2}
                        r={rMain}
                        fill="none"
                        stroke={colors.surface.pill}
                        strokeWidth={strokeMain}
                    />
                    <AnimatedCircle
                        cx={fitSize / 2}
                        cy={fitSize / 2}
                        r={rMain}
                        fill="none"
                        stroke={def.color}
                        strokeWidth={strokeMain}
                        strokeLinecap="round"
                        strokeDasharray={cMain}
                        animatedProps={mainAnimatedProps}
                        transform={`rotate(-90 ${fitSize / 2} ${fitSize / 2})`}
                    />
                </Svg>
                <View className="absolute inset-0 items-center justify-center">
                    <Text
                        className="font-display-bold leading-none text-text-primary"
                        style={{ fontSize: valueFont }}
                    >
                        {Math.round(value)}
                    </Text>
                    <Text
                        className="font-body text-text-tertiary"
                        style={{ fontSize: underLabelFont ?? 9 }}
                    >
                        /{goal}
                        {def.unit === "cal" ? "" : def.unit}
                    </Text>
                </View>
            </View>
            {labelFont > 0 ? (
                <Text
                    className="font-body-semibold text-text-secondary"
                    style={{ fontSize: labelFont }}
                >
                    {def.label}
                </Text>
            ) : null}
        </View>
    );
}

const DIMS_COMPACT: RingDims = {
    rMain: 28,
    strokeMain: 9,
    rOver: 38,
    strokeOver: 5,
    valueFont: 13,
    labelFont: 0,
    overBadgeLeft: -20,
    overBadgeTop: -4,
};

const DIMS_LARGE: RingDims = {
    rMain: 70,
    strokeMain: 18,
    rOver: 88,
    strokeOver: 8,
    valueFont: 30,
    labelFont: 13,
    underLabelFont: 13,
    overLabelFont: 14,
};

const DEFAULT_METRICS: Nutrient[] = ["calories"];

export function NutritionRingsView({
    data,
    settings,
    span,
}: WidgetViewProps<NutritionData, NutritionSettings>) {
    const { values, goals } = data;
    const metrics = settings.metrics.length ? settings.metrics : DEFAULT_METRICS;
    const list = metrics.filter((m) => METRIC_DEFS[m]).slice(0, maxRingsFor(span));
    const multi = list.length > 1;

    const size = sizeClass(span);
    const large = size === "large";
    // Only a single large ring gets the big preset; everything else
    // (small/medium, or several rings sharing the space) stays compact.
    const dims = !multi && large ? DIMS_LARGE : DIMS_COMPACT;
    const layoutClasses = multi
        ? `flex-row flex-wrap ${large ? "gap-x-[60px] gap-y-xl" : "gap-4xl"}`
        : large
          ? "flex-col gap-2xs"
          : "flex-row gap-sm";

    const firstKey = list[0];
    const firstDef = METRIC_DEFS[firstKey];

    return (
        <View className="min-h-0 flex-1 items-center justify-center">
            <View className={`items-center justify-center ${layoutClasses}`}>
                {list.map((key) => (
                    <Ring
                        key={key}
                        def={METRIC_DEFS[key]}
                        value={values[key]}
                        goal={goals[key]}
                        dims={dims}
                    />
                ))}
                {!multi && size === "medium" ? (
                    <View className="min-w-0 gap-[2px]">
                        <Text className="font-body-semibold text-2xs text-text-primary">
                            {firstDef.label}
                        </Text>
                        <Text className="font-body text-[11px] text-text-tertiary">
                            {values[firstKey]}
                            {firstDef.unit === "cal" ? " cal" : "g"} of {goals[firstKey]}
                            {firstDef.unit === "cal" ? "" : "g"}
                        </Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}
