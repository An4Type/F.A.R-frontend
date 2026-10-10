import { Pressable, Text, View } from "react-native";

interface SegmentedControlProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

/**
 * SegmentedControl component that displays a list of options as buttons. The selected option gets highlighted.
 */
export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
    return (
        <View className="flex-row gap-[2px] self-start rounded-pill bg-gray-100 p-3xs">
            {options.map((option) => {
                const active = option === value;
                return (
                    <Pressable
                        key={option}
                        onPress={() => onChange(option)}
                        className={`rounded-pill px-md py-[7px] ${active ? "bg-surface-card shadow-xs" : "bg-transparent"}`}
                    >
                        <Text
                            className={`font-body-semibold text-2xs ${active ? "text-action-primary" : "text-text-secondary"}`}
                        >
                            {option}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
