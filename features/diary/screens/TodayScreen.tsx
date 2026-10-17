import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { TAB_BAR_TOP_MARGIN } from "@/constants/layout";
import { colors } from "@/constants/theme";
import { FoodListItem, useDayInfoQuery } from "@/features/food";

export function TodayScreen() {
    const insets = useSafeAreaInsets();
    const { data: dayInfoList, isLoading, isFetching, error, refetch } = useDayInfoQuery();
    const data = dayInfoList?.[0];

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-surface-app">
                <ActivityIndicator size="large" color={colors.action.primary} />
                <Text className="mt-sm font-body text-sm text-text-secondary">Loading data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-surface-app p-xl">
                <Text className="text-center font-body text-sm text-action-danger">
                    Error: {error instanceof Error ? error.message : "Something went wrong"}
                </Text>
            </View>
        );
    }

    const { nutrition, foodConsumed = [] } = data || {};
    const totalCalories = nutrition?.calories || 0;
    const macros = nutrition || { fats: 0, carbohydrates: 0, proteins: 0 };

    return (
        <View className="flex-1 bg-surface-subtle-2">
            <View className="bg-surface-hero px-xl pb-4xl pt-3xl">
                <IconButton
                    icon="stats-chart-outline"
                    size={17}
                    onPress={() => router.push("/history")}
                    className="absolute right-xl top-xl z-10"
                />
                <View className="items-center">
                    <Text className="font-display-semibold text-xl text-text-on-brand">Today</Text>
                    <Text className="font-display-bold text-4xl tracking-tight text-text-on-brand">
                        {totalCalories} <Text className="font-display-medium text-lg">cal</Text>
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-sm p-xl"
                contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_TOP_MARGIN }}
            >
                {foodConsumed.length === 0 ? (
                    <EmptyState
                        icon="restaurant-outline"
                        title="No meals logged yet"
                        subtitle="Take a photo or pick a category to log your first meal today."
                    />
                ) : (
                    <>
                        {foodConsumed.map((item, index) => (
                            <FoodListItem
                                key={index}
                                name={item.food.name}
                                cal={item.nutrition.calories}
                            />
                        ))}

                        <Card>
                            <View className="flex-row justify-between">
                                <MacroStat label="Carbs" grams={macros.carbohydrates} />
                                <MacroStat label="Protein" grams={macros.proteins} />
                                <MacroStat label="Fat" grams={macros.fats} />
                            </View>
                        </Card>

                        <View className="mt-2xs items-center">
                            <Button
                                variant="outline"
                                loading={isFetching}
                                icon={
                                    <Ionicons
                                        name="refresh"
                                        size={18}
                                        color={colors.action.primary}
                                    />
                                }
                                onPress={() => refetch()}
                            >
                                Refresh
                            </Button>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

function MacroStat({ label, grams }: { label: string; grams: number }) {
    return (
        <View className="items-center">
            <Text className="font-body-medium text-2xs text-text-secondary">{label}</Text>
            <Text className="font-display-bold text-md text-text-primary">{grams}g</Text>
        </View>
    );
}
