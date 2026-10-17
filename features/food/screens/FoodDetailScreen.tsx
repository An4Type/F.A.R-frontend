import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { KEYBOARD_FIELD_OFFSET, TAB_BAR_TOP_MARGIN } from "@/constants/layout";
import { colors } from "@/constants/theme";
import { MacroStatBar } from "@/features/food/components/MacroStatBar";
import { dayInfoQueryKey } from "@/features/food/queries/useDayInfo";
import { goBack } from "@/lib/navigation";

// No backend endpoint exists for per-item detail yet, so this stays a
// local/mocked view: params carry name+cal, "Remove entry" is an optimistic
// local action (invalidate the real list, navigate back).
export function FoodDetailScreen() {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ slug: string; name?: string; cal?: string }>();
    const queryClient = useQueryClient();

    const name = params.name ?? params.slug ?? "Food";
    const baseCal = Number(params.cal) || 165;
    const [grams, setGrams] = useState("100");
    const scale = (Number(grams) || 0) / 100;

    const handleRemove = () => {
        queryClient.invalidateQueries({ queryKey: dayInfoQueryKey });
        goBack("/search");
    };

    return (
        <View className="flex-1 bg-surface-app">
            <ScreenHeader
                title={name}
                subtitle={`${Math.round(baseCal * scale)} cal`}
                onBack={() => goBack("/search")}
            />

            <KeyboardAwareScrollView
                bottomOffset={KEYBOARD_FIELD_OFFSET}
                className="flex-1"
                contentContainerClassName="px-xl pt-2xl"
                contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_TOP_MARGIN }}
            >
                <View className="mx-auto w-full max-w-[320px]">
                    <MacroStatBar
                        carbs={Math.round(30 * scale)}
                        proteins={Math.round(20 * scale)}
                        fat={Math.round(10 * scale)}
                    />
                </View>

                <View className="mt-2xl">
                    <TextInput
                        label="Grams"
                        keyboardType="number-pad"
                        value={grams}
                        onChangeText={setGrams}
                    />
                </View>

                <Button
                    fullWidth
                    variant="outline"
                    icon={<Ionicons name="trash-outline" size={18} color={colors.action.danger} />}
                    onPress={handleRemove}
                >
                    <Text className="font-body-semibold text-sm text-action-danger">
                        Remove entry
                    </Text>
                </Button>
            </KeyboardAwareScrollView>
        </View>
    );
}
