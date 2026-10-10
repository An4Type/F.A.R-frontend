import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, type ReactNode } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { colors } from "@/constants/theme";
import type { SettingsSession } from "@/features/widgets/settings/useSettingsSession";
import { GRID_REFLOW_DURATION } from "../board/DraggableGridItem";

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
    const { isOpen, stage, widgetDefinition, sections, activeSection, sectionProps } = session;

    // The editor card sits on whichever half of the screen the widget isn't
    // in, so the spotlighted widget stays visible.
    const editorAtBottom = anchor ? anchor.y + anchor.height / 2 < screenHeight / 2 : true;
    const justify =
        stage === "choose" ? "justify-center" : editorAtBottom ? "justify-end" : "justify-start";

    return (
        <Modal visible={isOpen} onClose={session.close} card={false}>
            {/* The configured widget is re-rendered above the blur at its live
                rect — simpler than carving a hole out of the blur, and it
                doubles as the live preview of the draft. */}
            {stage === "edit" && anchor ? (
                <SpotlightClone anchor={anchor}>{spotlight}</SpotlightClone>
            ) : null}

            <View pointerEvents="box-none" className={`absolute inset-0 items-center ${justify}`}>
                <Animated.View
                    layout={LinearTransition.duration(320)}
                    style={
                        stage === "choose"
                            ? { width: "100%", maxWidth: 408, paddingHorizontal: 24 }
                            : { width: "100%" }
                    }
                >
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
                </Animated.View>
            </View>
        </Modal>
    );
}
