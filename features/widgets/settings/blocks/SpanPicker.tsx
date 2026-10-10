import { View } from "react-native";
import { sameSpan, spanLabel } from "@/features/widgets/core/spans";
import type { Span, SpanOption } from "@/features/widgets/core/types";
import { OptionButton } from "@/features/widgets/settings/blocks/OptionButton";

interface SpanPickerProps {
    spans: SpanOption[];
    value: Span;
    onChange: (span: Span) => void;
}

export function SpanPicker({ spans, value, onChange }: SpanPickerProps) {
    return (
        <View className="flex-row gap-2xs">
            {spans.map((span) => (
                <OptionButton
                    key={`${span.w}x${span.h}`}
                    label={spanLabel(span)}
                    active={sameSpan(span, value)}
                    onPress={() => onChange({ w: span.w, h: span.h })}
                />
            ))}
        </View>
    );
}
