import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useLogFood } from "@/features/food/queries/useFoodMutations";
import type { FoodRecognitionResult } from "@/features/food/types";

interface FoodConfirmCardProps {
    food: FoodRecognitionResult;
    photoUri: string;
    onLogged: () => void;
    onRetake: () => void;
}

// Confirms a recognized food and the eaten amount, then logs it.
export function FoodConfirmCard({ food, photoUri, onLogged, onRetake }: FoodConfirmCardProps) {
    const [grams, setGrams] = useState("");
    const [error, setError] = useState<string | null>(null);
    const logFood = useLogFood();

    const confirm = async () => {
        const mass = parseFloat(grams);
        if (isNaN(mass)) {
            setError("Invalid number of grams");
            return;
        }
        try {
            await logFood.mutateAsync({ mass, foodCanName: food.canName });
            onLogged();
        } catch (err) {
            console.error("Logging food failed:", err);
            setError("Error submitting food");
        }
    };

    return (
        <View className="items-center bg-surface-card p-2xl">
            <Text className="text-center font-display-semibold text-lg text-text-primary">
                Is that {food.name}?
            </Text>
            {photoUri ? (
                <Image
                    source={{ uri: photoUri }}
                    className="my-md h-[130px] w-[130px] rounded-card"
                />
            ) : null}
            <View className="w-[85%]">
                <TextInput
                    label="Enter the number of grams"
                    keyboardType="number-pad"
                    value={grams}
                    onChangeText={setGrams}
                />
            </View>
            <View className="mb-sm w-[85%]">
                <Button fullWidth loading={logFood.isPending} onPress={confirm}>
                    Confirm
                </Button>
            </View>
            <Pressable onPress={onRetake}>
                <Text className="font-body-semibold text-sm text-action-primary">
                    Take Another Photo
                </Text>
            </Pressable>
            {error ? (
                <Text className="mt-sm text-center font-body text-2xs text-action-danger">
                    {error}
                </Text>
            ) : null}
        </View>
    );
}
