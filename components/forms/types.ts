import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Base form interface for forms that use react-hook-form.
 * Gives opportunity to pass in an external form instance in
 * order to control it from outside
 */
export interface BaseFormProps<Values extends FieldValues> {
    onSubmit: (values: Values) => void | Promise<void>;
    onCancel?: () => void;
    form?: UseFormReturn<Values>;
    defaultValues?: Partial<Values>;
    isLoading?: boolean;
    className?: string;
}
