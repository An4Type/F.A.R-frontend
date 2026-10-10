import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colors } from "@/constants/theme";
import type { MealGroup } from "@/features/food";
import { MealGroupEditorModal } from "@/features/widget-catalog/meal-groups/MealGroupEditorModal";
import { sizeClass, type WidgetViewProps } from "@/features/widgets";

function GroupRow({ group, onPress }: { group: MealGroup; onPress?: () => void }) {
    const pct = group.goal > 0 ? Math.min(100, Math.round((group.consumed / group.goal) * 100)) : 0;
    const animatedBarStyle = useAnimatedStyle(() => ({
        width: withTiming(`${pct}%`, { duration: 300 }),
    }));

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            className="min-w-0 flex-row items-center gap-2xs"
        >
            <View className="h-[24px] w-[24px] items-center justify-center rounded-pill bg-action-primary-tint">
                <Ionicons name={group.icon} size={12} color={colors.action["primary-active"]} />
            </View>
            <View className="min-w-0 flex-1">
                <View className="flex-row justify-between gap-[6px]">
                    <View className="min-w-0 flex-1 flex-row items-center gap-2xs">
                        <Text
                            numberOfLines={1}
                            className="shrink font-body-medium text-[12px] text-text-primary"
                        >
                            {group.name}
                        </Text>
                        {group.reminder && group.consumed === 0 ? (
                            <Ionicons
                                name="notifications-outline"
                                size={11}
                                color={colors.accent.orange}
                            />
                        ) : null}
                    </View>
                    <Text className="font-body text-[12px] text-text-tertiary">
                        {group.consumed}/{group.goal}
                    </Text>
                </View>
                <View className="mt-3xs h-[4px] overflow-hidden rounded-pill bg-gray-150">
                    {/* Reanimated components don't get className support. */}
                    <Animated.View
                        style={[
                            {
                                height: "100%",
                                borderRadius: 999,
                                backgroundColor: colors.action.primary,
                            },
                            animatedBarStyle,
                        ]}
                    />
                </View>
            </View>
        </Pressable>
    );
}

export function MealGroupsView({
    data: groups,
    span,
    editing,
    preview,
}: WidgetViewProps<MealGroup[], object>) {
    const [editor, setEditor] = useState<MealGroup | "new" | null>(null);
    const size = sizeClass(span);
    const count = size === "small" ? 0 : size === "medium" ? 2 : 5;
    const openNew = preview ? undefined : () => setEditor("new");

    return (
        <View className="h-full min-h-0 gap-2xs">
            {size !== "small" ? (
                <View className="flex-row justify-end">
                    <Pressable onPress={openNew} disabled={!openNew} hitSlop={8}>
                        <Ionicons
                            name="add-circle-outline"
                            size={17}
                            color={colors.action.primary}
                        />
                    </Pressable>
                </View>
            ) : null}

            {size === "small" ? (
                <Pressable
                    onPress={openNew}
                    disabled={!openNew}
                    className="flex-1 flex-row items-center justify-center gap-[6px]"
                >
                    <Text className="font-display-bold text-lg text-text-primary">
                        {groups.length}
                    </Text>
                    <Text className="font-body text-[11px] text-text-tertiary">groups</Text>
                </Pressable>
            ) : (
                <View className="min-h-0 flex-1 gap-2xs">
                    {groups.length === 0 ? (
                        <Text className="font-body text-[12px] text-text-tertiary">
                            Add your first meal group
                        </Text>
                    ) : null}
                    {groups.slice(0, count).map((group) => (
                        <GroupRow
                            key={group.id}
                            group={group}
                            // Rows open the editor in edit mode; otherwise taps
                            // fall through to nothing, so a row can't be
                            // edited by accident while scrolling.
                            onPress={editing && !preview ? () => setEditor(group) : undefined}
                        />
                    ))}
                </View>
            )}

            {preview ? null : (
                <MealGroupEditorModal group={editor} onClose={() => setEditor(null)} />
            )}
        </View>
    );
}
