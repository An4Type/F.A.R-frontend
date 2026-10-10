import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { sizeClass, type WidgetViewProps } from "@/features/widgets";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export interface StreakData {
    streakDays: number;
    weekAvgCal: number;
    goalMetDays: boolean[];
}

export function StreakView({ data, span }: WidgetViewProps<StreakData, object>) {
    const { streakDays, weekAvgCal, goalMetDays } = data;
    const size = sizeClass(span);
    const large = size === "large";

    return (
        <View
            className={`min-h-0 flex-1 items-center justify-center ${large ? "gap-sm" : "gap-2xs"}`}
        >
            <View className="flex-row items-baseline gap-[6px]">
                <Ionicons name="flame" size={large ? 26 : 20} color={colors.accent.orange} />
                <Text
                    className={`font-display-bold leading-none text-text-primary ${large ? "text-[30px]" : "text-[22px]"}`}
                >
                    {streakDays}
                </Text>
                <Text className="font-body text-[11px] text-text-tertiary">
                    day{streakDays === 1 ? "" : "s"}
                </Text>
            </View>

            {size !== "small" ? (
                <View className={`flex-row justify-center ${large ? "gap-2xs" : "gap-[6px]"}`}>
                    {goalMetDays.slice(0, 7).map((met, i) => (
                        <View key={i} className="items-center gap-[3px]">
                            <View
                                className={`rounded-pill ${large ? "h-[12px] w-[12px]" : "h-[9px] w-[9px]"} ${met ? "bg-action-primary" : "border border-gray-300 bg-gray-150"}`}
                            />
                            {large ? (
                                <Text className="font-body text-[9px] text-text-tertiary">
                                    {DAY_LABELS[i]}
                                </Text>
                            ) : null}
                        </View>
                    ))}
                </View>
            ) : null}

            {large ? (
                <Text className="font-body text-[12px] text-text-secondary">
                    <Text className="font-body-bold text-text-primary">{weekAvgCal}</Text> cal avg
                    this week
                </Text>
            ) : null}
        </View>
    );
}
