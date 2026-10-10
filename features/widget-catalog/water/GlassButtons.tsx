import { Pressable, Text } from "react-native";

export function AddGlassButton({ label, onPress }: { label: string; onPress?: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            className="items-center rounded-pill border-[1.5px] border-macro-water px-sm py-[7px]"
        >
            <Text className="font-body-semibold text-[12px] text-macro-water-dark">{label}</Text>
        </Pressable>
    );
}

export function UndoGlassButton({ size, onPress }: { size: number; onPress?: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            className="items-center justify-center rounded-pill border-[1.5px] border-gray-300"
            style={{ width: size, height: size }}
        >
            <Text className="font-body-semibold text-[12px] text-text-secondary">−</Text>
        </Pressable>
    );
}
