import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import { type ReactNode } from "react";
import { colors } from "@/constants/theme";

type ButtonVariant = "primary" | "outline" | "text" | "danger";

interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    onPress?: PressableProps["onPress"];
    fullWidth?: boolean;
    className?: string;
}

const CONTAINER_CLASSES: Record<ButtonVariant, string> = {
    primary: "bg-action-primary shadow-brand",
    outline: "bg-transparent border-[1.5px] border-action-primary",
    text: "bg-transparent px-2xs",
    danger: "bg-action-danger",
};

const TEXT_CLASSES: Record<ButtonVariant, string> = {
    primary: "text-text-on-brand",
    outline: "text-action-primary",
    text: "text-action-primary",
    danger: "text-text-on-brand",
};

export function Button({
    children,
    variant = "primary",
    disabled = false,
    loading = false,
    icon = null,
    onPress,
    fullWidth = false,
    className = "",
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            className={`h-[40px] flex-row items-center justify-center gap-2xs rounded-xs px-[22px] active:scale-[0.97] ${CONTAINER_CLASSES[variant]} ${fullWidth ? "w-full" : "self-start"} ${isDisabled ? "opacity-45" : ""} ${className}`}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === "primary" || variant === "danger"
                            ? colors.text["on-brand"]
                            : colors.action.primary
                    }
                />
            ) : (
                <>
                    {icon}
                    <Text className={`font-body-semibold text-sm ${TEXT_CLASSES[variant]}`}>
                        {children}
                    </Text>
                </>
            )}
        </Pressable>
    );
}
