import { Form, type FormField } from "@/components/forms/Form";
import type { BaseFormProps } from "@/components/forms/types";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/registerSchema";

const FIELDS: FormField<RegisterFormValues>[] = [
    { name: "username", label: "Username" },
    {
        name: "email",
        label: "Email",
        input: { textContentType: "emailAddress", keyboardType: "email-address" },
    },
    {
        name: "password",
        label: "Password",
        input: { textContentType: "password", secureTextEntry: true },
    },
];

interface RegisterFormProps extends BaseFormProps<RegisterFormValues> {
    onCancel: () => void;
}

export function RegisterForm(props: RegisterFormProps) {
    return (
        <Form
            {...props}
            schema={registerSchema}
            fields={FIELDS}
            title="Sign up"
            submitLabel="Sign up"
            cancelLabel="Back to login"
        />
    );
}
