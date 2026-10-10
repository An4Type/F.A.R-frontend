import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";

interface LimitedMultiSelectProps<Key extends string> {
    options: { key: Key; label: string }[];
    value: Key[];
    max: number;
    onChange: (value: Key[]) => void;
    hint?: (max: number) => string;
}

// Returns the new selection after tapping an option in a limited multi-select list:
// - tapping a selected key deselects it, unless it's the only one left
// - tapping an unselected key adds it; if max options are already selected,
//   the earliest pick is dropped to make room.
export function toggleLimited<Key>(current: Key[], key: Key, max: number): Key[] {
    if (current.includes(key)) {
        return current.length > 1 ? current.filter((k) => k !== key) : current;
    }
    return current.length >= max ? [...current.slice(1), key] : [...current, key];
}

export function LimitedMultiSelect<Key extends string>({
    options,
    value,
    max,
    onChange,
    hint,
}: LimitedMultiSelectProps<Key>) {
    return (
        <View className="gap-2xs">
            {hint ? (
                <Text className="mb-2xs text-center font-body text-[12px] text-text-tertiary">
                    {hint(max)}
                </Text>
            ) : null}
            {options.map((option) => {
                const active = value.includes(option.key);
                return (
                    <Pressable
                        key={option.key}
                        onPress={() => onChange(toggleLimited(value, option.key, max))}
                        className={`flex-row items-center justify-between rounded-card px-md py-[11px] ${active ? "bg-action-primary-tint" : "bg-surface-subtle"}`}
                    >
                        <Text
                            className={`font-body-semibold text-sm ${active ? "text-action-primary" : "text-text-primary"}`}
                        >
                            {option.label}
                        </Text>
                        {active ? (
                            <Ionicons name="checkmark" size={15} color={colors.action.primary} />
                        ) : null}
                    </Pressable>
                );
            })}
        </View>
    );
}
