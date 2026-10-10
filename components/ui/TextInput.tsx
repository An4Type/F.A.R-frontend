import { useState, forwardRef } from "react";
import { Text, TextInput as RNTextInput, View, type TextInputProps } from "react-native";
import { colors } from "@/constants/theme";

interface Props extends TextInputProps {
    label: string;
    errorText?: string;
}

/**
 * TextInput component with label and error text. The label is displayed above the input field and the error text is displayed below the input field.
 */
// forwardRef is used to allow the parent component to access the ref of the TextInput component
// in order to give possibility to forms to focus the input fields sequentially when pressing "next" on the keyboard
export const TextInput = forwardRef<RNTextInput, Props>(
    ({ label, errorText, onFocus, onBlur, ...rest }, ref) => {
        const [focused, setFocused] = useState(false);

        return (
            <View className="mb-[2px] w-full">
                <View
                    className={`relative rounded-xs border-[1.5px] bg-surface-card ${focused ? "border-action-primary" : "border-border-input"}`}
                >
                    <View className="absolute -top-[9px] left-[10px] z-10 bg-surface-card px-3xs">
                        <Text
                            className={`font-body-medium text-[12px] ${focused ? "text-action-primary" : "text-text-secondary"}`}
                        >
                            {label}
                        </Text>
                    </View>
                    <RNTextInput
                        ref={ref}
                        className="w-full rounded-xs px-md py-[14px] font-body text-sm text-text-primary"
                        placeholderTextColor={colors.text.tertiary}
                        onFocus={(e) => {
                            setFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setFocused(false);
                            onBlur?.(e);
                        }}
                        {...rest}
                    />
                </View>
                <Text
                    numberOfLines={1}
                    className="h-[18px] px-3xs pt-[2px] font-body text-2xs text-action-danger"
                >
                    {errorText ?? ""}
                </Text>
            </View>
        );
    }
);

TextInput.displayName = "TextInput";
