import { zodResolver } from "@hookform/resolvers/zod";
import {
    Controller,
    useForm,
    type DefaultValues,
    type FieldValues,
    type Path,
} from "react-hook-form";
import { Text, View, type TextInputProps } from "react-native";
import type { z } from "zod";
import type { BaseFormProps } from "@/components/forms/types";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

export interface FormField<Values extends FieldValues> {
    name: Path<Values>;
    label: string;
    // Extra TextInput props, everything else is handled by form
    input?: Omit<
        TextInputProps,
        "value" | "onChangeText" | "onBlur" | "onSubmitEditing" | "returnKeyType"
    >;
}

export interface FormProps<Values extends FieldValues> extends BaseFormProps<Values> {
    schema: z.ZodType<Values, Values>;
    fields: FormField<Values>[];
    title: string;
    subtitle?: string;
    submitLabel: string;
    // Shown as a label for a secondary button when onCancel is set.
    cancelLabel?: string;
}

/**
 * A titled text-field form validated by a zod schema. Return on a field
 * moves focus to the next one, and on the last field submits.
 */
export function Form<Values extends FieldValues>({
    schema,
    fields,
    title,
    subtitle,
    submitLabel,
    cancelLabel,
    onSubmit,
    onCancel,
    form: externalForm,
    defaultValues,
    isLoading = false,
    className = "",
}: FormProps<Values>) {
    const internalForm = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...Object.fromEntries(fields.map((field) => [field.name, ""])),
            ...defaultValues,
        } as DefaultValues<Values>,
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const form = externalForm ?? internalForm;
    const busy = isLoading || form.formState.isSubmitting;
    const submit = form.handleSubmit((values) => onSubmit(values));

    return (
        <View className={`w-full flex-1 p-2xl ${className}`}>
            <Text
                className={`font-display-bold text-2xl tracking-tight text-text-primary ${subtitle ? "mb-[6px]" : "mb-[26px]"}`}
            >
                {title}
            </Text>
            {subtitle ? (
                <Text className="mb-[26px] font-body text-sm text-text-secondary">{subtitle}</Text>
            ) : null}

            <View className="gap-2xs">
                {fields.map((field, index) => {
                    const next = fields[index + 1];
                    return (
                        <Controller
                            key={field.name}
                            control={form.control}
                            name={field.name}
                            render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
                                <TextInput
                                    autoCapitalize="none"
                                    {...field.input}
                                    ref={ref}
                                    label={field.label}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    returnKeyType={next ? "next" : "done"}
                                    onSubmitEditing={() =>
                                        next ? form.setFocus(next.name) : submit()
                                    }
                                    errorText={fieldState.error?.message}
                                />
                            )}
                        />
                    );
                })}
            </View>

            <View className="flex-1" />

            <View className="gap-md">
                <Button fullWidth onPress={submit} disabled={busy}>
                    {submitLabel}
                </Button>
                {onCancel && cancelLabel ? (
                    <Button fullWidth variant="outline" onPress={onCancel}>
                        {cancelLabel}
                    </Button>
                ) : null}
            </View>
        </View>
    );
}
