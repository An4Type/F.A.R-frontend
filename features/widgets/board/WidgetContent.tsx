import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { WidgetDefinition, WidgetInstance } from "@/features/widgets/core/types";

interface WidgetContentProps {
    definition: WidgetDefinition;
    widget: WidgetInstance;
    data: unknown;
    loading?: boolean;
    failed?: boolean;
    editing?: boolean;
    preview?: boolean;
}

// Renders the widget's current variant with its data, measuring the content
// area so views can adapt to their real size.
export function WidgetContent({
    definition,
    widget,
    data,
    loading = false,
    failed = false,
    editing = false,
    preview = false,
}: WidgetContentProps) {
    const [frame, setFrame] = useState({ width: 0, height: 0 });
    const variant =
        definition.variants[widget.variant] ?? definition.variants[definition.defaultVariant];
    const pressable = !!definition.onPress && !editing && !preview && !loading && !failed;

    let body;
    if (loading) {
        body = <View className="flex-1 rounded-xs bg-gray-150" />;
    } else if (failed) {
        body = (
            <View className="flex-1 items-center justify-center">
                <Text className="font-body text-[12px] text-text-tertiary">Couldn&apos;t load</Text>
            </View>
        );
    } else {
        body = (
            <variant.View
                data={data}
                settings={widget.settings}
                span={widget.span}
                frame={frame}
                editing={editing}
                preview={preview}
            />
        );
    }

    return (
        <Pressable
            disabled={!pressable}
            onPress={() => definition.onPress?.({ widget, data })}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setFrame({ width, height });
            }}
            className="min-h-0 flex-1"
        >
            {body}
        </Pressable>
    );
}
