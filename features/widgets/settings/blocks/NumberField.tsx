import { TextInput } from "@/components/ui/TextInput";

interface NumberFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
}

export function NumberField({ label, value, onChange, min = 0 }: NumberFieldProps) {
    return (
        <TextInput
            label={label}
            keyboardType="number-pad"
            value={String(value)}
            onChangeText={(text) => onChange(Math.max(min, parseInt(text, 10) || 0))}
        />
    );
}
