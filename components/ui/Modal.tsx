import { BlurView } from "expo-blur";
import { useEffect, useState, type ReactNode } from "react";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useBlurTarget } from "@/components/ui/BlurTarget";
import { Portal } from "@/components/ui/Portal";

const FADE_DURATION = 200;

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    card?: boolean;
}

/**
 * Modal component that displays a modal with a blurred background. Can optionally show a card around the content.
 *
 * Rendered through a Portal in the app's own window rather than RN's Modal,
 * which on Android is a separate window: there the blur only refreshed when
 * the modal itself redrew, positions measured in the app didn't match the modal's
 * coordinates, and Reanimated layout transitions inside it stalled.
 */
export function Modal({ visible, onClose, children, card = true }: ModalProps) {
    const blurTarget = useBlurTarget();

    // Stays mounted after `visible` turns false until the fade-out finishes.
    const [rendered, setRendered] = useState(visible);
    if (visible && !rendered) setRendered(true);

    const opacity = useSharedValue(0);
    useEffect(() => {
        opacity.value = withTiming(visible ? 1 : 0, { duration: FADE_DURATION }, (finished) => {
            if (finished && !visible) scheduleOnRN(setRendered, false);
        });
    }, [visible, opacity]);

    // RN's Modal closed on the Android back button via onRequestClose.
    useEffect(() => {
        if (!visible) return;
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            onClose();
            return true;
        });
        return () => subscription.remove();
    }, [visible, onClose]);

    const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
    const keyboardStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: keyboardHeight.value / 2 }],
    }));

    if (!rendered) return null;

    return (
        <Portal>
            <Animated.View
                pointerEvents={visible ? "auto" : "none"}
                style={[StyleSheet.absoluteFill, fadeStyle]}
            >
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
                    <View className="flex-1 items-center justify-center" pointerEvents="box-none">
                        <Animated.View style={keyboardStyle}>
                            <View className="mx-2xl min-w-[280px] rounded-card bg-surface-card p-2xl shadow-lg">
                                {children}
                            </View>
                        </Animated.View>
                    </View>
                ) : (
                    // Full-screen overlay: the host places its content and
                    // follows the keyboard itself (see SlidingCard).
                    children
                )}
            </Animated.View>
        </Portal>
    );
}
