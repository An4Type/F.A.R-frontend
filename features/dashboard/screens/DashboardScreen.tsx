import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/layout/EmptyState";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuthStore } from "@/features/auth";
import { HeaderLayout } from "@/features/dashboard/components/header/HeaderLayout";
import { SetGoalModal } from "@/features/dashboard/components/modals/SetGoalModal";
import { useLayoutStore } from "@/features/dashboard/store/layoutStore";
import { useDayInfoQuery } from "@/features/food";
import { useProfileStore } from "@/features/profile";
import { widgetSystem } from "@/features/widget-catalog";
import type { GridConfig } from "@/features/widgets";

const GRID: GridConfig = {
    columns: (width) => (width >= 600 ? 4 : 2),
    rowHeight: 140,
    gap: 12,
};

export function DashboardScreen() {
    const insets = useSafeAreaInsets();
    const logout = useAuthStore((state) => state.logout);
    const caloriesGoal = useProfileStore((state) => state.caloriesGoal);
    const { data: dayInfo } = useDayInfoQuery();
    const layout = useLayoutStore((state) => state.layout);
    const setLayout = useLayoutStore((state) => state.setLayout);

    const [editing, setEditing] = useState(false);
    const [configuring, setConfiguring] = useState(false);
    const [goalModalOpen, setGoalModalOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const calories = dayInfo?.[0]?.nutrition.calories ?? 0;

    return (
        <View className="flex-1 bg-surface-app">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20 }}
                scrollEnabled={!configuring}
            >
                <HeaderLayout
                    remainingCalories={Math.max(0, caloriesGoal - calories)}
                    editing={editing}
                    setEditing={setEditing}
                    setGoalModalOpen={setGoalModalOpen}
                    logout={logout}
                    headerHeight={headerHeight}
                    setHeaderHeight={setHeaderHeight}
                />

                <View className="p-xl">
                    {editing ? (
                        <Text className="mb-sm text-center font-body text-[12px] text-text-tertiary">
                            Drag to reorder · hold to open settings · tap ✕ to remove
                        </Text>
                    ) : null}

                    <widgetSystem.Board
                        layout={layout}
                        onLayoutChange={setLayout}
                        gridConfig={GRID}
                        editing={editing}
                        onEditingChange={setEditing}
                        onConfiguringChange={setConfiguring}
                        renderEmpty={(openPicker) => (
                            <EmptyState
                                icon="apps-outline"
                                title="Your dashboard is empty"
                                subtitle="Add widgets to see your day at a glance."
                                actionLabel="Add widget"
                                onAction={openPicker}
                            />
                        )}
                    />
                </View>
            </ScrollView>

            <SetGoalModal visible={goalModalOpen} onClose={() => setGoalModalOpen(false)} />
        </View>
    );
}
