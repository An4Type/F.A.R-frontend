import { View, type ViewProps } from "react-native";

type CardTone = "default" | "subtle";

export interface CardProps extends ViewProps {
    className?: string;
    tone?: CardTone;
}

const TONE_CLASSES: Record<CardTone, string> = {
    default: "bg-surface-card shadow-card",
    subtle: "bg-surface-subtle-2",
};

export function Card({ className = "", tone = "default", children, ...rest }: CardProps) {
    return (
        <View className={`rounded-card p-sm ${TONE_CLASSES[tone]} ${className}`} {...rest}>
            {children}
        </View>
    );
}
