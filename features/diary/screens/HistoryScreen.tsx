import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors } from "@/constants/theme";
import { useWeeklyHistory } from "@/features/diary/queries/useWeeklyHistory";
import { useProfileStore } from "@/features/profile";

const RANGE_OPTIONS = ["Day", "Week", "Month"];
const CHART_HEIGHT = 140;

export function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [range, setRange] = useState("Week");
    const caloriesGoal = useProfileStore((state) => state.caloriesGoal);
    const { data: days, isLoading } = useWeeklyHistory();

    const maxVal = Math.max(caloriesGoal, ...(days?.map((d) => d.calories) ?? [0]));
    const avg =
        days && days.length > 0
            ? Math.round(days.reduce((a, d) => a + d.calories, 0) / days.length)
            : 0;
    const overCount = days?.filter((d) => d.calories > caloriesGoal).length ?? 0;

    return (
        <View className="flex-1 bg-surface-app">
            <ScreenHeader title="History" onBack={() => router.back()} />

            <ScrollView
                className="flex-1"
                contentContainerClassName="px-xl pt-2xl"
                contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20 }}
            >
                <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={setRange} />

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.action.primary}
                        className="mt-4xl"
                    />
                ) : range === "Week" ? (
                    <View className="mt-2xl">
                        <View className="h-[160px] flex-row items-end justify-between gap-2xs">
                            {(days ?? []).map((d) => {
                                const over = d.calories > caloriesGoal;
                                return (
                                    <View key={d.day} className="flex-1 items-center gap-[6px]">
                                        <View
                                            className={`w-full max-w-[26px] rounded-[6px] ${over ? "bg-macro-protein" : "bg-action-primary"}`}
                                            style={{
                                                height: Math.max(
                                                    4,
                                                    Math.round((d.calories / maxVal) * CHART_HEIGHT)
                                                ),
                                            }}
                                        />
                                        <Text className="font-body text-[11px] text-text-tertiary">
                                            {d.day}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View className="mt-lg flex-row items-center gap-2xs">
                            <View className="h-[8px] w-[8px] rounded-pill bg-action-primary" />
                            <Text className="font-body text-[12px] text-text-secondary">
                                Within goal
                            </Text>
                            <View className="ml-xs h-[8px] w-[8px] rounded-pill bg-macro-protein" />
                            <Text className="font-body text-[12px] text-text-secondary">
                                Over goal
                            </Text>
                        </View>

                        <Card tone="subtle" className="mt-xl">
                            <View className="flex-row justify-around">
                                <Stat label="Avg / day" value={avg} />
                                <Stat label="Days over goal" value={overCount} />
                            </View>
                        </Card>
                    </View>
                ) : (
                    <Text className="mt-4xl text-center font-body text-sm text-text-tertiary">
                        {range} view coming soon.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <View className="items-center">
            <Text className="font-body text-[12px] text-text-secondary">{label}</Text>
            <Text className="font-display-bold text-md text-text-primary">{value}</Text>
        </View>
    );
}
