import { CameraView, type CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecognizeFood } from "@/features/food/queries/useFoodMutations";
import type { FoodRecognitionResult } from "@/features/food/types";

interface CameraCaptureProps {
    onRecognized: (result: { food: FoodRecognitionResult; uri: string }) => void;
}

// Live camera with flip/shutter controls; a taken photo is sent for
// recognition and the result handed to the parent.
export function CameraCapture({ onRecognized }: CameraCaptureProps) {
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraType>("back");
    const [error, setError] = useState<string | null>(null);
    const recognize = useRecognizeFood();

    const takePhoto = async () => {
        if (!cameraRef.current) return;
        setError(null);
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: true,
                imageType: "jpg",
            });
            if (photo?.uri) onRecognized(await recognize.mutateAsync(photo));
        } catch (err) {
            console.error("Taking photo failed:", err);
            setError("Couldn't identify that photo. Try again.");
        }
    };

    return (
        <View className="h-[320px] justify-end">
            {/* Third-party view: NativeWind className doesn't apply here. */}
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
            {error ? (
                <Text className="bg-black/50 px-lg pt-sm text-center font-body text-2xs text-text-on-brand">
                    {error}
                </Text>
            ) : null}
            <View className="flex-row justify-around bg-black/50 p-lg">
                <Pressable
                    onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
                    className="rounded-pill bg-surface-card px-md py-xs"
                >
                    <Text className="font-body-semibold text-sm text-text-primary">
                        Flip Camera
                    </Text>
                </Pressable>
                <Pressable
                    onPress={takePhoto}
                    className="rounded-pill bg-action-primary px-md py-xs"
                >
                    <Text className="font-body-semibold text-sm text-text-on-brand">
                        Take Photo
                    </Text>
                </Pressable>
            </View>
            {recognize.isPending ? (
                <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <Text className="font-body text-sm text-text-on-brand">
                        Identifying meal...
                    </Text>
                </View>
            ) : null}
        </View>
    );
}
