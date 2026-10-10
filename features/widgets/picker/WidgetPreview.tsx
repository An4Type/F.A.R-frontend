import { View } from "react-native";
import { WidgetContent } from "@/features/widgets/board/WidgetContent";
import { WidgetShell } from "@/features/widgets/board/WidgetShell";
import type { Span, WidgetDefinition } from "@/features/widgets/core/types";

export interface CellMetrics {
    colWidth: number;
    rowHeight: number;
    gap: number;
}

interface WidgetPreviewProps {
    definition: WidgetDefinition;
    variant: string;
    span: Span;
    cell: CellMetrics;
    maxWidth: number;
    maxHeight?: number;
}

// Renders the widget at its real on-grid size with sample data, then scales
// it down to fit — so previews match the grid exactly instead of being a
// separate thumbnail design.
export function WidgetPreview({
    definition,
    variant,
    span,
    cell,
    maxWidth,
    maxHeight = maxWidth,
}: WidgetPreviewProps) {
    const width = span.w * cell.colWidth + (span.w - 1) * cell.gap;
    const height = span.h * cell.rowHeight + (span.h - 1) * cell.gap;
    // The grid hasn't been measured yet (e.g. opened from an empty board).
    if (width <= 0 || height <= 0) return null;
    const scale = Math.min(1, maxWidth / width, maxHeight / height);

    return (
        <View style={{ width: width * scale, height: height * scale }} pointerEvents="none">
            <View style={{ width, height, transform: [{ scale }], transformOrigin: "top left" }}>
                <WidgetShell title={definition.label}>
                    <WidgetContent
                        definition={definition}
                        widget={{
                            id: "preview",
                            type: definition.type,
                            variant,
                            span,
                            settings: definition.defaultSettings,
                        }}
                        data={definition.previewData}
                        preview
                    />
                </WidgetShell>
            </View>
        </View>
    );
}
