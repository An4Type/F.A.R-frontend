import Ionicons from "@expo/vector-icons/Ionicons";
import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { KEYBOARD_FIELD_OFFSET, TAB_BAR_TOP_MARGIN } from "@/constants/layout";
import { colors } from "@/constants/theme";
import { CameraCapture } from "@/features/food/components/CameraCapture";
import { CategoryTile } from "@/features/food/components/CategoryTile";
import { FoodConfirmCard } from "@/features/food/components/FoodConfirmCard";
import { CATEGORIES } from "@/features/food/constants";
import type { FoodRecognitionResult } from "@/features/food/types";

export function LogMealScreen() {
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [recognized, setRecognized] = useState<{
        food: FoodRecognitionResult;
        uri: string;
    } | null>(null);
    const [toastVisible, setToastVisible] = useState(false);

    if (!permission) {
        return <View className="flex-1 bg-surface-subtle-2" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center gap-md bg-surface-subtle-2 p-xl">
                <Text className="text-center font-body text-sm text-text-secondary">
                    We need your permission to use the camera
                </Text>
                <Button onPress={requestPermission}>Grant Permission</Button>
            </View>
        );
    }

    const handleLogged = () => {
        setShowCamera(false);
        setRecognized(null);
        setToastVisible(true);
    };

    return (
        <View className="flex-1 bg-surface-subtle-2">
            <ScreenHeader
                title="Log a meal"
                subtitle="Snap a photo or pick a category"
                leading={
                    <View className="h-[44px] w-[44px] items-center justify-center rounded-pill bg-white/20">
                        <Ionicons name="camera-outline" size={22} color={colors.text["on-brand"]} />
                    </View>
                }
            />

            <KeyboardAwareScrollView
                bottomOffset={KEYBOARD_FIELD_OFFSET}
                className="flex-1"
                contentContainerClassName="px-xl py-2xl"
                contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_TOP_MARGIN }}
            >
                <Button
                    fullWidth
                    icon={<Ionicons name="camera" size={18} color={colors.text["on-brand"]} />}
                    onPress={() => setShowCamera((prev) => !prev)}
                >
                    {showCamera ? "Close camera" : "Take a photo"}
                </Button>

                {showCamera ? (
                    <View className="mt-lg overflow-hidden rounded-card bg-surface-dark shadow-md">
                        {recognized ? (
                            <FoodConfirmCard
                                food={recognized.food}
                                photoUri={recognized.uri}
                                onLogged={handleLogged}
                                onRetake={() => setRecognized(null)}
                            />
                        ) : (
                            <CameraCapture onRecognized={setRecognized} />
                        )}
                    </View>
                ) : (
                    <View className="mt-2xl flex-row flex-wrap gap-2xs">
                        {CATEGORIES.map((category) => (
                            <View key={category.slug} className="w-[31%]">
                                <CategoryTile
                                    label={category.label}
                                    icon={category.icon}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/search/category/[id]",
                                            params: { id: category.slug },
                                        })
                                    }
                                />
                            </View>
                        ))}
                    </View>
                )}
            </KeyboardAwareScrollView>

            <Toast
                message="Meal logged"
                visible={toastVisible}
                onDismiss={() => setToastVisible(false)}
            />
        </View>
    );
}
