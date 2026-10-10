import { BlurView } from "expo-blur";
import { type ReactNode } from "react";
import { Pressable, Modal as RNModal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    return (
        <RNModal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            {/* RN's Modal is a separate native window; gesture-handler gestures
                inside it (e.g. the goal ring) only work on Android with their
                own root view. */}
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View className="flex-1 items-center justify-center" pointerEvents="box-none">
                    <Pressable className="absolute inset-0" onPress={onClose} />
                    <BlurView
                        intensity={50}
                        tint="dark"
                        experimentalBlurMethod="dimezisBlurView"
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
