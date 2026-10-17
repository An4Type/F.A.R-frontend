import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { colors } from "@/constants/theme";
import { measureInWindow } from "@/features/widgets/layout/measureInWindow";
import { SlidingCard, type Placement } from "@/features/widgets/settings/SlidingCard";
import type { SettingsSession } from "@/features/widgets/settings/useSettingsSession";
import { GRID_REFLOW_DURATION } from "../board/DraggableGridItem";
import { TAB_BAR_TOP_MARGIN } from "@/constants/layout";

const gridReflow = { duration: GRID_REFLOW_DURATION, easing: Easing.linear };

export interface Anchor {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Animates its own position/size via shared values instead of Reanimated's
// `layout` prop, which didn't visibly animate an absolutely positioned view
// driven from props. Starts at `anchor` on mount, animates later changes.
function SpotlightClone({ anchor, children }: { anchor: Anchor; children: ReactNode }) {
    const x = useSharedValue(anchor.x);
    const y = useSharedValue(anchor.y);
    const width = useSharedValue(anchor.width);
    const height = useSharedValue(anchor.height);

    useEffect(() => {
        x.value = withTiming(anchor.x, gridReflow);
        y.value = withTiming(anchor.y, gridReflow);
        width.value = withTiming(anchor.width, gridReflow);
        height.value = withTiming(anchor.height, gridReflow);
    }, [anchor.x, anchor.y, anchor.width, anchor.height, x, y, width, height]);

    const animatedStyle = useAnimatedStyle(() => ({
        position: "absolute",
        left: x.value,
        top: y.value,
        width: width.value,
        height: height.value,
    }));

    return (
        <Animated.View pointerEvents="none" style={animatedStyle}>
            {children}
        </Animated.View>
    );
}

interface WidgetSettingsHostProps {
    session: SettingsSession;
    anchor: Anchor | null;
    spotlight: ReactNode;
}

export function WidgetSettingsHost({ session, anchor, spotlight }: WidgetSettingsHostProps) {
    const { height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { isOpen, stage, widgetDefinition, sections, activeSection, sectionProps } = session;

    // `anchor` comes from measureInWindow, which on Android measures from
    // below the status bar while the overlay starts at the top of the screen.
    // Measuring the overlay's own origin the same way and subtracting it puts
    // the spotlight in the overlay's coordinates on every platform.
    const originRef = useRef<View>(null);
    const [overlayOrigin, setOverlayOrigin] = useState<{ x: number; y: number } | null>(null);
    const spotlightAnchor =
        anchor && overlayOrigin
            ? { ...anchor, x: anchor.x - overlayOrigin.x, y: anchor.y - overlayOrigin.y }
            : null;

    // The editor card sits on whichever half of the screen the widget isn't
    // in, so the spotlighted widget stays visible.
    const editorAtBottom = anchor ? anchor.y + anchor.height / 2 < screenHeight / 2 : true;
    const placement: Placement = stage === "choose" ? "center" : editorAtBottom ? "bottom" : "top";

    return (
        <Modal visible={isOpen} onClose={session.close} card={false}>
            <View
                ref={originRef}
                pointerEvents="none"
                className="absolute inset-0"
                onLayout={async () => setOverlayOrigin(await measureInWindow(originRef))}
            />

            {/* The configured widget is re-rendered above the blur at its live
                rect — simpler than carving a hole out of the blur, and it
                doubles as the live preview of the draft. */}
            {stage === "edit" && spotlightAnchor ? (
                <SpotlightClone anchor={spotlightAnchor}>{spotlight}</SpotlightClone>
            ) : null}

            <SlidingCard placement={placement} narrow={stage === "choose"}>
                {stage === "choose" || !activeSection || !sectionProps ? (
                    <View className="rounded-card bg-surface-card p-2xl shadow-lg">
                        <Text className="mb-xl text-center font-display-semibold text-md text-text-primary">
                            Configure {widgetDefinition?.label ?? "widget"}
                        </Text>
                        <View className="gap-sm">
                            {sections.map((s) => (
                                <Pressable
                                    key={s.key}
                                    onPress={() => session.chooseSection(s.key)}
                                    className="flex-row items-center gap-sm rounded-card border-[1.5px] border-border bg-surface-card px-md py-sm"
                                >
                                    <View className="h-[40px] w-[40px] items-center justify-center rounded-pill bg-action-primary-tint">
                                        <Ionicons
                                            name={s.icon}
                                            size={19}
                                            color={colors.action["primary-active"]}
                                        />
                                    </View>
                                    <Text className="flex-1 font-body-semibold text-xs text-text-primary">
                                        {s.label}
                                    </Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color={colors.text.tertiary}
                                    />
                                </Pressable>
                            ))}
                            <Button
                                fullWidth
                                variant="danger"
                                onPress={session.close}
                                className="mt-xl"
                            >
                                Close
                            </Button>
                        </View>
                    </View>
                ) : (
                    <View
                        className={`bg-surface-card p-xl shadow-lg ${editorAtBottom ? "rounded-t-[24px]" : "rounded-b-[24px]"}`}
                        style={
                            editorAtBottom
                                ? { paddingBottom: insets.bottom + TAB_BAR_TOP_MARGIN }
                                : { paddingTop: 20 + insets.top }
                        }
                    >
                        <View className="mb-lg flex-row items-center gap-2xs">
                            {sections.length > 1 ? (
                                <Pressable onPress={session.backToSections} hitSlop={8}>
                                    <Ionicons
                                        name="chevron-back"
                                        size={18}
                                        color={colors.action["primary-active"]}
                                    />
                                </Pressable>
                            ) : (
                                <View className="w-[18px]" />
                            )}
                            <Text className="flex-1 text-center font-display-semibold text-[17px] text-text-primary">
                                {activeSection.label}
                            </Text>
                            <View className="w-[18px]" />
                        </View>

                        <View className="mb-lg">
                            <activeSection.Component {...sectionProps} />
                        </View>

                        <View className="flex-row gap-2xs">
                            <View className="flex-1">
                                <Button fullWidth variant="outline" onPress={session.close}>
                                    Cancel
                                </Button>
                            </View>
                            <View className="flex-1">
                                <Button fullWidth onPress={session.commit}>
                                    Accept
                                </Button>
                            </View>
                        </View>
                    </View>
                )}
            </SlidingCard>
        </Modal>
    );
}
