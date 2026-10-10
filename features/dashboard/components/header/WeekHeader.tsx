import { Text, View } from "react-native";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type DayState = "past" | "today" | "future";

const DAY_CIRCLE_CLASSES: Record<DayState, string> = {
    past: "bg-white/[0.22]",
    today: "bg-surface-app",
    future: "border-[1.5px] border-white/30",
};

interface WeekHeaderProps {
    today?: Date;
    className?: string;
}

/**
 * Week header component for the dashboard.
 * Displays a row of days with their labels and dates.
 * The current day is highlighted.
 */
export function WeekHeader({ today = new Date(), className = "" }: WeekHeaderProps) {
    const todayDay = today.getDay();

    const weekDates = DAY_LABELS.map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - todayDay + i);
        return d;
    });

    return (
        <View className={`mt-md flex-row justify-between ${className}`}>
            {weekDates.map((date, i) => {
                const state: DayState = i < todayDay ? "past" : i === todayDay ? "today" : "future";
                return (
                    <View key={i} className="items-center gap-2xs">
                        <Text className="font-body-semibold text-[10.5px] text-white/70">
                            {DAY_LABELS[i]}
                        </Text>
                        <View
                            className={`h-[28px] w-[28px] items-center justify-center rounded-pill ${DAY_CIRCLE_CLASSES[state]}`}
                        >
                            <Text
                                className={`font-display-bold text-[12px] ${state === "today" ? "text-action-primary" : "text-text-on-brand"}`}
                            >
                                {date.getDate()}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
