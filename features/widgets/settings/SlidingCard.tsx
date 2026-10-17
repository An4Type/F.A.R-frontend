import { useEffect, type ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export type Placement = "center" | "top" | "bottom";

const CARD_SLIDE = { duration: 320 };
// Where the card sits in the free space above/below it: 0 = top, 1 = bottom.
const ALIGN: Record<Placement, number> = { top: 0, center: 0.5, bottom: 1 };
const NARROW_MAX_WIDTH = 408;
const NARROW_GUTTER = 24;

interface SlidingCardProps {
    placement: Placement;
    // Narrow: capped width with side gutters (e.g. the section chooser);
    // otherwise edge to edge.
    narrow: boolean;
    children: ReactNode;
}

export function SlidingCard({ placement, narrow, children }: SlidingCardProps) {
    // The overlay spans the window, so widths are known up front; heights
    // are measured into shared values, not state: they change every frame
    // while the width animates, and re-targeting the slide on each change
    // kept restarting it, which made it crawl.
    const { width: windowWidth } = useWindowDimensions();
    const boxHeight = useSharedValue(-1);
    const cardHeight = useSharedValue(-1);

    const targetWidth = narrow ? Math.min(NARROW_MAX_WIDTH, windowWidth) : windowWidth;
    const targetGutter = narrow ? NARROW_GUTTER : 0;
    const width = useSharedValue(targetWidth);
    const gutter = useSharedValue(targetGutter);
    // Only the alignment animates, once per placement change; the position
    // follows from it and the live heights every frame.
    const align = useSharedValue(ALIGN[placement]);

    useEffect(() => {
        width.value = withTiming(targetWidth, CARD_SLIDE);
        gutter.value = withTiming(targetGutter, CARD_SLIDE);
    }, [targetWidth, targetGutter, width, gutter]);

    useEffect(() => {
        align.value = withTiming(ALIGN[placement], CARD_SLIDE);
    }, [placement, align]);

    const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

    const animatedStyle = useAnimatedStyle(() => {
        const measured = boxHeight.value >= 0 && cardHeight.value >= 0;
        return {
            position: "absolute",
            top: measured ? align.value * (boxHeight.value - cardHeight.value) : 0,
            transform: [{ translateY: align.value * keyboardHeight.value }],
            left: (windowWidth - width.value) / 2,
            width: width.value,
            paddingHorizontal: gutter.value,
            // Hidden until measured, so it never flashes at the top.
            opacity: measured ? 1 : 0,
        };
    });

    return (
        <View
            pointerEvents="box-none"
            className="absolute inset-0"
            onLayout={(e) => {
                boxHeight.value = e.nativeEvent.layout.height;
            }}
        >
            <Animated.View
                style={animatedStyle}
                onLayout={(e) => {
                    cardHeight.value = e.nativeEvent.layout.height;
                }}
            >
                {children}
            </Animated.View>
        </View>
    );
}
