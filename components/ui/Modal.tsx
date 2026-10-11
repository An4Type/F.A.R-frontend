import { BlurView } from "expo-blur";
import { type ReactNode } from "react";
import { Pressable, Modal as RNModal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useBlurTarget } from "@/components/ui/BlurTarget";

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    card?: boolean;
}

/**
 * Modal component that displays a modal with a blurred background. Can optionally show a card around the content.
 */
export function Modal({ visible, onClose, children, card = true }: ModalProps) {
    const blurTarget = useBlurTarget();

    return (
        // Translucent bars let the backdrop reach under the status and
        // navigation bars on Android (edge-to-edge); iOS already does.
        <RNModal
            transparent
            statusBarTranslucent
            navigationBarTranslucent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View className="flex-1 items-center justify-center" pointerEvents="box-none">
                    <Pressable className="absolute inset-0" onPress={onClose} />
                    <BlurView
                        intensity={50}
                        tint="dark"
                        // Android only: blurs the app root (BlurTargetProvider);
                        // on Android 11 and below it falls back to a tint.
                        blurMethod="dimezisBlurViewSdk31Plus"
                        blurTarget={blurTarget}
                        pointerEvents="none"
                        className="absolute inset-0"
                    />
                    {card ? (
                        <View className="mx-2xl min-w-[280px] rounded-card bg-surface-card p-2xl shadow-lg">
                            {children}
                        </View>
                    ) : (
                        children
                    )}
                </View>
            </GestureHandlerRootView>
        </RNModal>
    );
}
