import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps } from "react";
import { View } from "react-native";

type IoniconsProps = ComponentProps<typeof Ionicons>;

interface TabBarIconProps {
    name: IoniconsProps["name"];
    color: IoniconsProps["color"];
    focused?: boolean;
}

export function TabBarIcon({ name, color, focused = false }: TabBarIconProps) {
    return (
        <View
            className={`h-[44px] w-[44px] items-center justify-center rounded-pill ${focused ? "bg-action-primary-tint" : "bg-transparent"}`}
        >
            <Ionicons name={name} size={24} color={color} />
        </View>
    );
}
