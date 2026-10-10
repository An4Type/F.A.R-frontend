import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/features/auth";
import { CircularGoalControl } from "@/features/profile/components/CircularGoalControl";
import { useProfileStore } from "@/features/profile/store/profileStore";

interface SettingsRow {
    icon: ComponentProps<typeof Ionicons>["name"];
    label: string;
    value?: string;
    onPress?: () => void;
}

export function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const caloriesGoal = useProfileStore((state) => state.caloriesGoal);
    const setCaloriesGoal = useProfileStore((state) => state.setCaloriesGoal);
    const units = useProfileStore((state) => state.units);
    const setUnits = useProfileStore((state) => state.setUnits);
    const remindersEnabled = useProfileStore((state) => state.remindersEnabled);
    const logout = useAuthStore((state) => state.logout);

    const [goalDraft, setGoalDraft] = useState(caloriesGoal);

    const handleLogOut = () => {
        logout();
    };

    const rows: SettingsRow[] = [
        {
            icon: "scale-outline",
            label: "Units",
            value: units,
            onPress: () => setUnits(units === "Grams" ? "Ounces" : "Grams"),
        },
        {
            icon: "notifications-outline",
            label: "Reminders",
            value: remindersEnabled ? "On" : "Off",
        },
        { icon: "shield-checkmark-outline", label: "Privacy" },
        { icon: "help-circle-outline", label: "Help & feedback" },
    ];

    return (
        <View className="flex-1 bg-surface-subtle-2">
            <ScreenHeader title="Profile" />

            <ScrollView
                className="flex-1"
                contentContainerClassName="p-xl"
                contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20 }}
            >
                <View className="items-center rounded-card bg-surface-card p-lg shadow-sm">
                    <Text className="mb-2xs font-body-semibold text-sm text-text-secondary">
                        Daily calorie goal
                    </Text>
                    <View className="-mb-3xl scale-[0.82]">
                        <CircularGoalControl value={goalDraft} onChange={setGoalDraft} />
                    </View>
                    <Button onPress={() => setCaloriesGoal(goalDraft)} className="mt-[6px]">
                        Save goal
                    </Button>
                </View>

                <View className="mt-md overflow-hidden rounded-card bg-surface-card shadow-sm">
                    {rows.map((row, i) => (
                        <Pressable
                            key={row.label}
                            onPress={row.onPress}
                            className={`flex-row items-center justify-between p-md ${i < rows.length - 1 ? "border-b border-border" : ""}`}
                        >
                            <View className="flex-row items-center gap-sm">
                                <Ionicons name={row.icon} size={19} color={colors.action.primary} />
                                <Text className="font-body-medium text-xs text-text-primary">
                                    {row.label}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-2xs">
                                {row.value ? (
                                    <Text className="font-body text-sm text-text-tertiary">
                                        {row.value}
                                    </Text>
                                ) : null}
                                <Ionicons
                                    name="chevron-forward"
                                    size={15}
                                    color={colors.text.tertiary}
                                />
                            </View>
                        </Pressable>
                    ))}
                </View>

                <Pressable
                    onPress={handleLogOut}
                    className="mt-md flex-row items-center gap-sm rounded-card bg-surface-card p-md shadow-sm"
                >
                    <Ionicons name="log-out-outline" size={19} color={colors.action.danger} />
                    <Text className="font-body-medium text-xs text-action-danger">Log out</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
