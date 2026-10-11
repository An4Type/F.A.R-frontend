import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/theme";

interface CircularGoalControlProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    presets?: number[];
}

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 78;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Touches count as "on the ring" within this distance of it; the centre
// (the tap-to-type value) and the outside pass through to other handlers.
const RING_HIT_SLOP = 34;

const isOnRing = (x: number, y: number) =>
    Math.abs(Math.hypot(x - CENTER, y - CENTER) - RADIUS) <= RING_HIT_SLOP;

export function CircularGoalControl({
    value = 2000,
    min = 1200,
    max = 5000,
    step = 50,
    onChange,
    presets = [1800, 2200, 2800, 3500, 4500],
}: CircularGoalControlProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value));
    const inputRef = useRef<TextInput>(null);

    const isOver = value > max;
    const pct = isOver ? 1 : Math.max(0, (value - min) / (max - min));
    const angleDeg = pct * 360;
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    const handleX = CENTER + RADIUS * Math.cos(angleRad);
    const handleY = CENTER + RADIUS * Math.sin(angleRad);

    // Value at a point in the control's own coordinates (0° = 12 o'clock).
    const valueAt = (x: number, y: number) => {
        let deg = (Math.atan2(x - CENTER, CENTER - y) * 180) / Math.PI;
        if (deg < 0) deg += 360;
        const snapped = Math.round((min + (deg / 360) * (max - min)) / step) * step;
        return Math.max(min, Math.min(max, snapped));
    };

    const dragTo = (x: number, y: number) => {
        let next = valueAt(x, y);
        // Crossing 12 o'clock would jump straight between min and max; stop
        // at whichever end the drag came from instead. `value` may trail the
        // drag by a frame, which is far below the half-range this checks for.
        const half = (max - min) / 2;
        if (value <= max && Math.abs(next - value) > half) {
            next = value - min < half ? min : max;
        }
        onChange?.(next);
    };

    // Event x/y are relative to the ring itself, so no on-screen measuring is
    // needed. Manual activation claims touches on the ring band immediately
    // (before a surrounding ScrollView can) and lets everything else through.
    const pan = Gesture.Pan()
        .runOnJS(true)
        .manualActivation(true)
        .onTouchesDown((e, manager) => {
            const touch = e.changedTouches[0];
            if (touch && isOnRing(touch.x, touch.y)) {
                manager.activate();
                dragTo(touch.x, touch.y);
            } else {
                manager.fail();
            }
        })
        .onUpdate((e) => dragTo(e.x, e.y));

    const step_ = (delta: number) => onChange?.(Math.max(min, value + delta));

    const startEdit = () => {
        setDraft(String(value));
        setEditing(true);
    };

    const commitEdit = () => {
        const n = parseInt(draft, 10);
        if (!isNaN(n) && n > 0) onChange?.(n);
        setEditing(false);
    };

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    return (
        <View className="items-center gap-lg">
            <GestureDetector gesture={pan}>
                <View className="h-[200px] w-[200px]">
                    <Svg width={SIZE} height={SIZE}>
                        <Circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS}
                            fill="none"
                            stroke={colors.surface.pill}
                            strokeWidth={STROKE}
                        />
                        <Circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS}
                            fill="none"
                            stroke={
                                isOver ? colors.action["primary-active"] : colors.action.primary
                            }
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
                            transform={`rotate(-90 ${CENTER} ${CENTER})`}
                        />
                        {!isOver ? (
                            <Circle
                                cx={handleX}
                                cy={handleY}
                                r={STROKE / 2 + 5}
                                fill={colors.surface.app}
                                stroke={colors.action.primary}
                                strokeWidth={3}
                            />
                        ) : null}
                    </Svg>

                    {isOver ? (
                        <View className="absolute right-[6px] top-xs rounded-pill bg-action-primary-active px-2xs py-[3px] shadow-xs">
                            <Text className="font-body-bold text-[11px] text-text-on-brand">
                                +{value - max} over ring
                            </Text>
                        </View>
                    ) : null}

                    <View className="absolute inset-0 items-center justify-center">
                        {editing ? (
                            <TextInput
                                ref={inputRef}
                                value={draft}
                                onChangeText={setDraft}
                                onBlur={commitEdit}
                                onSubmitEditing={commitEdit}
                                keyboardType="number-pad"
                                className="w-[120px] border-b-2 border-action-primary text-center font-display-bold text-[34px] text-text-primary"
                            />
                        ) : (
                            <Pressable onPress={startEdit}>
                                <Text className="border-b-[1.5px] border-dashed border-gray-300 font-display-bold text-3xl tracking-tight text-text-primary">
                                    {value}
                                </Text>
                            </Pressable>
                        )}
                        <Text className="mt-3xs font-body text-2xs text-text-tertiary">
                            cal / day · tap to type
                        </Text>
                    </View>
                </View>
            </GestureDetector>

            <View className="flex-row items-center gap-lg">
                <Pressable
                    onPress={() => step_(-step)}
                    className="h-[40px] w-[40px] items-center justify-center rounded-pill border-[1.5px] border-border-input bg-surface-card shadow-xs"
                >
                    <Text className="font-body-bold text-md text-text-primary">−</Text>
                </Pressable>
                <Text className="font-body text-2xs text-text-tertiary">
                    drag ring or tap ±{step}
                </Text>
                <Pressable
                    onPress={() => step_(step)}
                    className="h-[40px] w-[40px] items-center justify-center rounded-pill border-[1.5px] border-border-input bg-surface-card shadow-xs"
                >
                    <Text className="font-body-bold text-md text-text-primary">+</Text>
                </Pressable>
            </View>

            <View className="max-w-[280px] flex-row flex-wrap justify-center gap-2xs">
                {presets.map((p) => {
                    const active = value === p;
                    return (
                        <Pressable
                            key={p}
                            onPress={() => onChange?.(p)}
                            className={`rounded-pill border-[1.5px] px-md py-[7px] ${
                                active
                                    ? "border-action-primary bg-action-primary-tint"
                                    : "border-border bg-surface-card"
                            }`}
                        >
                            <Text
                                className={`font-body-semibold text-2xs ${active ? "text-action-primary" : "text-text-secondary"}`}
                            >
                                {p}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
