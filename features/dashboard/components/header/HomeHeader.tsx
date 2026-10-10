import { type ReactNode } from "react";
import { Text, View } from "react-native";

interface HomeHeaderProps {
    today?: Date;
    remainingCalories?: number;
    setHeaderHeight: (height: number) => void;
    actions?: ReactNode;
    children?: ReactNode;
}

export function HomeHeader({
    today = new Date(),
    remainingCalories,
    setHeaderHeight,
    actions,
    children,
}: HomeHeaderProps) {
    const monthDay = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const hour = today.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <View
            className="px-xl pb-3xl pt-lg"
            onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="font-display-bold text-xl tracking-tight text-text-on-brand">
                        AnyMeal
                    </Text>
                    <Text className="mt-[2px] font-body text-2xs text-text-on-brand-muted">
                        {monthDay}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2xs">{actions}</View>
            </View>

            <Text className="mt-lg font-display-semibold text-lg text-text-on-brand">
                {greeting} — <Text className="font-display-bold">{remainingCalories}</Text> cal left
            </Text>
            {children}
        </View>
    );
}
