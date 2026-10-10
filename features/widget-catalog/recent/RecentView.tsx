import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import type { IconName } from "@/features/food";
import { sizeClass, type WidgetViewProps } from "@/features/widgets";

export interface RecentFood {
    name: string;
    calories: number;
    icon?: IconName;
}

export function RecentView({ data: foods, span }: WidgetViewProps<RecentFood[], object>) {
    const size = sizeClass(span);
    const count = size === "small" ? 0 : size === "medium" ? 2 : 4;

    return (
        <View className="h-full min-h-0 gap-2xs">
            {size === "small" ? (
                foods[0] ? (
                    <View className="flex-1 items-center justify-center gap-3xs">
                        <Ionicons
                            name={foods[0].icon ?? "restaurant-outline"}
                            size={22}
                            color={colors.action.primary}
                        />
                        <Text className="font-body-medium text-[11px] text-text-secondary">
                            {foods.length} today
                        </Text>
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="font-body text-[11px] text-text-tertiary">
                            Nothing yet
                        </Text>
                    </View>
                )
            ) : (
                <View className="min-h-0 flex-1 gap-[7px]">
                    {foods.length === 0 ? (
                        <Text className="font-body text-[12px] text-text-tertiary">
                            Nothing logged yet
                        </Text>
                    ) : null}
                    {foods.slice(0, count).map((f, i) => (
                        <View key={i} className="min-w-0 flex-row items-center gap-2xs">
                            <View className="h-[26px] w-[26px] items-center justify-center rounded-pill bg-action-primary-tint">
                                <Ionicons
                                    name={f.icon ?? "restaurant-outline"}
                                    size={13}
                                    color={colors.action["primary-active"]}
                                />
                            </View>
                            <Text
                                numberOfLines={1}
                                className="flex-1 font-body-medium text-[12.5px] text-text-primary"
                            >
                                {f.name}
                            </Text>
                            <Text className="font-body-bold text-[12px] text-text-primary">
                                {f.calories}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
