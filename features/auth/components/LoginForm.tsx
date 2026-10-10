import { Form, type FormField } from "@/components/forms/Form";
import type { BaseFormProps } from "@/components/forms/types";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/loginSchema";

const FIELDS: FormField<LoginFormValues>[] = [
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

interface LoginFormProps extends BaseFormProps<LoginFormValues> {
    onCancel: () => void;
}

export function LoginForm(props: LoginFormProps) {
    return (
        <Form
            {...props}
            schema={loginSchema}
            fields={FIELDS}
            title="Sign in"
            subtitle="Track today's meals in seconds."
            submitLabel="Sign in"
            cancelLabel="Register"
        />
    );
}
