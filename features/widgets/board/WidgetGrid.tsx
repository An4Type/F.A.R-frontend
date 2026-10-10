import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, type ReactNode, type RefObject } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { colors } from "@/constants/theme";
import { DraggableGridItem } from "@/features/widgets/board/DraggableGridItem";
import type { WidgetInstance } from "@/features/widgets/core/types";
import type { GridLayout } from "@/features/widgets/layout/useGridLayout";
import type { PackedRect } from "@/features/widgets/layout/packGrid";

interface WidgetGridProps {
    layout: WidgetInstance[];
    grid: GridLayout;
    // Kept apart from `grid` (render data) so nothing reads a ref in render.
    containerRef: RefObject<View>;
    editing: boolean;
    onEnterEdit: () => void;
    renderWidget: (widget: WidgetInstance, state: { isDragOver: boolean }) => ReactNode;
    onReorder: (fromId: string, toId: string) => void;
    onOpenSettings: (id: string) => void;
    onAddAt: (insertIndex: number) => void;
}

// Positions widgets at their packed rects and handles edit-mode gestures:
// long-press to enter editing, drag by the header to reorder, hold to open
// settings, and "Add widget" tiles in open cells.
export function WidgetGrid({
    layout,
    grid,
    containerRef,
    editing,
    onEnterEdit,
    renderWidget,
    onReorder,
    onOpenSettings,
    onAddAt,
}: WidgetGridProps) {
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // Only enabled outside editing, so it never fights the drag gesture.
    const longPressToEdit = Gesture.LongPress()
        .enabled(!editing)
        .minDuration(550)
        .onStart(() => {
            runOnJS(onEnterEdit)();
        });

    return (
        <GestureDetector gesture={longPressToEdit}>
            <View ref={containerRef} onLayout={grid.onLayout} style={{ height: grid.height }}>
                {layout.map((widget) => {
                    const rect = grid.rects[widget.id];
                    if (!rect) return null;
                    return (
                        <DraggableGridItem
                            key={widget.id}
                            id={widget.id}
                            rect={rect}
                            editing={editing}
                            rectsShared={grid.rectsShared}
                            onDragStart={() => {}}
                            onDragOverChange={setDragOverId}
                            onDrop={(fromId, toId) => toId && onReorder(fromId, toId)}
                            onOpenSettings={onOpenSettings}
                        >
                            {renderWidget(widget, { isDragOver: dragOverId === widget.id })}
                        </DraggableGridItem>
                    );
                })}

                {editing
                    ? grid.emptySlots.map((slot, i) => (
                          <EmptySlot
                              key={`empty-${i}`}
                              rect={slot.rect}
                              onPress={() => onAddAt(slot.insertIndex)}
                          />
                      ))
                    : null}
            </View>
        </GestureDetector>
    );
}

function EmptySlot({ rect, onPress }: { rect: PackedRect; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            className="absolute items-center justify-center gap-[6px] rounded-card border-[1.5px] border-dashed border-gray-300"
            style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
        >
            <Ionicons name="add-circle-outline" size={26} color={colors.action.primary} />
            <Text className="font-body-semibold text-[12px] text-action-primary">Add widget</Text>
        </Pressable>
    );
}
