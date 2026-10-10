import { type ReactNode } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import type { PackedRect } from "@/features/widgets/layout/packGrid";

// Matches WidgetSettingsModal's spotlight clone, which uses Reanimated's
// `LinearTransition` that have constant velocity and duration of the same
// 250ms for the same rect change. Reanimated's default `withTiming` easing
// is ease-in-out, not linear — same duration but a different velocity what
// cause visible drifts for the clone in mid transition
export const GRID_REFLOW_DURATION = 250;
const gridReflow = { duration: GRID_REFLOW_DURATION, easing: Easing.linear };

interface DraggableGridItemProps {
    id: string;
    rect: PackedRect;
    editing: boolean;
    // All current items' rects, kept in a shared value by the parent so the
    // gesture worklet can check intersections between widgets on the UI thread without
    // crossing back to JS every frame.
    rectsShared: Animated.SharedValue<Record<string, PackedRect>>;
    onDragStart: (id: string) => void;
    onDragOverChange: (id: string | null) => void;
    onDrop: (fromId: string, toId: string | null) => void;
    onOpenSettings?: (id: string) => void;
    children: ReactNode;
}

// Reordering only starts from a touch within this many px of the card's
// top edge (the header row, marked by a grip icon) — otherwise a drag
// will cause interaction with scrollview
const HANDLE_HEIGHT = 40;

export function DraggableGridItem({
    id,
    rect,
    editing,
    rectsShared,
    onDragStart,
    onDragOverChange,
    onDrop,
    onOpenSettings,
    children,
}: DraggableGridItemProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const currentTargetId = useSharedValue<string | null>(null);

    const homeX = rect.x + rect.width / 2;
    const homeY = rect.y + rect.height / 2;

    const pan = Gesture.Pan()
        .enabled(editing)
        .hitSlop({ top: 0, height: HANDLE_HEIGHT })
        .onStart(() => {
            isDragging.value = true;
            runOnJS(onDragStart)(id);
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;

            const centerX = homeX + event.translationX;
            const centerY = homeY + event.translationY;

            // This widget's own (untranslated) slot is a candidate target
            // too, like any neighbor
            let nearestId: string | null = null;
            let nearestDist = (homeX - centerX) ** 2 + (homeY - centerY) ** 2;

            const rects = rectsShared.value;
            for (const otherId in rects) {
                if (otherId === id) continue;
                const other = rects[otherId];
                const ocx = other.x + other.width / 2;
                const ocy = other.y + other.height / 2;
                const dist = (ocx - centerX) ** 2 + (ocy - centerY) ** 2;
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestId = otherId;
                }
            }

            if (nearestId !== currentTargetId.value) {
                currentTargetId.value = nearestId;
                runOnJS(onDragOverChange)(nearestId);
            }
        })
        .onEnd(() => {
            isDragging.value = false;
            translateX.value = 0;
            translateY.value = 0;
            const target = currentTargetId.value;
            currentTargetId.value = null;
            runOnJS(onDrop)(id, target);
            runOnJS(onDragOverChange)(null);
        });

    // Holding still (rather than dragging) while editing opens this widget's
    // settings — raced against the pan gesture so whichever the user
    // actually does (hold vs. move) wins and cancels the other.
    const longPressSettings = Gesture.LongPress()
        .enabled(editing && !!onOpenSettings)
        .minDuration(400)
        .onStart(() => {
            if (onOpenSettings) runOnJS(onOpenSettings)(id);
        });

    const gesture = Gesture.Race(pan, longPressSettings);

    const animatedStyle = useAnimatedStyle(
        () => ({
            position: "absolute",
            left: withTiming(rect.x, gridReflow),
            top: withTiming(rect.y, gridReflow),
            width: withTiming(rect.width, gridReflow),
            height: withTiming(rect.height, gridReflow),
            transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
            zIndex: isDragging.value ? 10 : 1,
        }),
        [rect.x, rect.y, rect.width, rect.height]
    );

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={animatedStyle}>{children}</Animated.View>
        </GestureDetector>
    );
}
