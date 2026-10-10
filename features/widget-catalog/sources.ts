import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useAuthStore } from "@/features/auth";
import { useWeeklyHistory } from "@/features/diary";
import { useDayInfoQuery, useMealGroupStore, useWaterStore } from "@/features/food";
import { useProfileStore } from "@/features/profile";
import { defineWidget, type SourceResult } from "@/features/widgets";

// Every piece of app data a widget can read. The board calls each hook once
// per render; `active` is false when no placed widget uses the source.

function useTodaySource({ active }: { active: boolean }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const caloriesGoal = useProfileStore((state) => state.caloriesGoal);
    const query = useDayInfoQuery({ enabled: active });
    const { refetch } = query;

    useFocusEffect(
        useCallback(() => {
            if (active && isAuthenticated) refetch();
        }, [active, isAuthenticated, refetch])
    );

    const { nutrition, foodConsumed = [] } = query.data?.[0] ?? {};
    return {
        data: {
            caloriesGoal,
            calories: nutrition?.calories ?? 0,
            macros: {
                carbs: nutrition?.carbohydrates ?? 0,
                protein: nutrition?.proteins ?? 0,
                fat: nutrition?.fats ?? 0,
            },
            foods: foodConsumed.map((item) => ({
                name: item.food.name,
                calories: item.nutrition.calories,
            })),
        },
        isLoading: query.isLoading,
        error: query.error,
    };
}

function useWeekSource({ active }: { active: boolean }) {
    const caloriesGoal = useProfileStore((state) => state.caloriesGoal);
    const query = useWeeklyHistory({ enabled: active });
    return {
        data: { days: query.data ?? [], caloriesGoal },
        isLoading: query.isLoading,
        error: query.error,
    };
}

function useWaterSource() {
    const consumedMl = useWaterStore((state) => state.consumedMl);
    const addWater = useWaterStore((state) => state.addWater);
    return { data: { consumedMl, addWater } };
}

function useMealGroupsSource() {
    const groups = useMealGroupStore((state) => state.groups);
    return { data: { groups } };
}

export const catalogSources = {
    today: useTodaySource,
    week: useWeekSource,
    water: useWaterSource,
    mealGroups: useMealGroupsSource,
} satisfies Record<string, (options: { active: boolean }) => SourceResult<unknown>>;

export type CatalogSources = typeof catalogSources;

export const defineCatalogWidget = defineWidget<CatalogSources>();
