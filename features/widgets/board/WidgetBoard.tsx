import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { View } from "react-native";
import { DEFAULT_QUICK_ACTIONS } from "@/features/widgets/board/quickActions";
import { WidgetContent } from "@/features/widgets/board/WidgetContent";
import { WidgetGrid } from "@/features/widgets/board/WidgetGrid";
import { WidgetShell } from "@/features/widgets/board/WidgetShell";
import {
    createInstance,
    insertAt,
    removeById,
    reorder,
    updateById,
} from "@/features/widgets/core/layoutOps";
import { nextSpan } from "@/features/widgets/core/spans";
import type {
    GridConfig,
    QuickActionContext,
    SourceMap,
    WidgetDefinition,
    WidgetInstance,
    WidgetPatch,
} from "@/features/widgets/core/types";
import { useSourceData } from "@/features/widgets/core/useSourceData";
import { widgetContext } from "@/features/widgets/core/widgetContext";
import { measureInWindow } from "@/features/widgets/layout/measureInWindow";
import { useGridLayout } from "@/features/widgets/layout/useGridLayout";
import { AddWidgetSheet } from "@/features/widgets/picker/AddWidgetSheet";
import { useSettingsSession } from "@/features/widgets/settings/useSettingsSession";
import { WidgetSettingsHost } from "@/features/widgets/settings/WidgetSettingsHost";

export type AnyWidgetDefinition = WidgetDefinition<any, any, any>;

export interface WidgetBoardProps {
    layout: WidgetInstance[];
    onLayoutChange: (layout: WidgetInstance[]) => void;
    gridConfig: GridConfig;
    editing: boolean;
    onEditingChange: (editing: boolean) => void;
    // True while the settings modal is open, e.g. to lock the page scroll.
    onConfiguringChange?: (configuring: boolean) => void;
    // Shown instead of the grid when the layout is empty outside edit mode.
    renderEmpty?: (openPicker: () => void) => ReactNode;
}

interface BoundProps {
    sources: SourceMap;
    definitions: AnyWidgetDefinition[];
}

export function WidgetBoard({
    sources,
    definitions,
    layout,
    onLayoutChange,
    gridConfig,
    editing,
    onEditingChange,
    onConfiguringChange,
    renderEmpty,
}: WidgetBoardProps & BoundProps) {
    // useMemo is used to avoid re-creating the map on every render
    const byType = useMemo(() => new Map(definitions.map((d) => [d.type, d])), [definitions]);
    // Widgets whose type is no longer registered are skipped, not crashed on.
    const placed = layout.filter((w) => byType.has(w.type));

    const session = useSettingsSession({
        layout: placed,
        definitionOf: (type) => byType.get(type),
        onCommit: (widgetId, draft) => onLayoutChange(updateById(layout, widgetId, draft)),
    });
    const display = placed.map(session.withDraft);

    const activeSources = new Set(placed.flatMap((w) => byType.get(w.type)?.sources ?? []));
    const sourceState = useSourceData(sources, activeSources);

    // Only read in openSettings (an event), never during render.
    const gridRef = useRef<View>(null);
    const grid = useGridLayout({
        items: display.map((w) => ({ id: w.id, span: w.span })),
        grid: gridConfig,
        editing,
    });

    const [insertIndex, setInsertIndex] = useState<number | null>(null);
    const [gridOrigin, setGridOrigin] = useState({ x: 0, y: 0 });

    const configuring = session.isOpen;
    useEffect(() => {
        onConfiguringChange?.(configuring);
    }, [configuring, onConfiguringChange]);

    const openSettings = async (id: string) => {
        // Settings overlay a spotlight on the widget, so it needs the grid's
        // position on screen; the page can't scroll while it's open.
        setGridOrigin(await measureInWindow(gridRef));
        session.open(id);
    };

    const quickActionContextFor = (widget: WidgetInstance): QuickActionContext => {
        const base = widgetContext(widget, byType.get(widget.type)!);
        const update = (patch: WidgetPatch) => onLayoutChange(updateById(layout, widget.id, patch));
        return {
            ...base,
            update,
            openSettings: () => openSettings(widget.id),
            cycleSpan: () => update({ span: nextSpan(base.spansFor(widget.variant), widget.span) }),
            remove: () => onLayoutChange(removeById(layout, widget.id)),
        };
    };

    const renderContent = (widget: WidgetInstance, isEditing: boolean) => {
        const definition = byType.get(widget.type)!;
        const statuses = definition.sources.map((key: string) => sourceState.status[key]);
        return (
            <WidgetContent
                definition={definition}
                widget={widget}
                data={definition.select(sourceState.data, widget.settings)}
                loading={statuses.some((s: { isLoading: boolean }) => s?.isLoading)}
                failed={statuses.some((s: { error?: unknown }) => !!s?.error)}
                editing={isEditing}
            />
        );
    };

    const previewWidget = session.editedWidget && session.withDraft(session.editedWidget);
    const previewRect = previewWidget ? grid.rects[previewWidget.id] : undefined;
    const anchor = previewRect
        ? {
              x: gridOrigin.x + previewRect.x,
              y: gridOrigin.y + previewRect.y,
              width: previewRect.width,
              height: previewRect.height,
          }
        : null;

    const cellMetrics = {
        colWidth: grid.metrics.colWidth,
        rowHeight: grid.metrics.rowHeight,
        gap: grid.metrics.gap,
    };

    return (
        <>
            {placed.length === 0 && !editing && renderEmpty ? (
                renderEmpty(() => {
                    onEditingChange(true);
                    setInsertIndex(0);
                })
            ) : (
                <WidgetGrid
                    containerRef={gridRef}
                    layout={display}
                    grid={grid}
                    editing={editing}
                    onEnterEdit={() => onEditingChange(true)}
                    onReorder={(fromId, toId) => onLayoutChange(reorder(layout, fromId, toId))}
                    onOpenSettings={openSettings}
                    onAddAt={setInsertIndex}
                    renderWidget={(widget, { isDragOver }) => {
                        const definition = byType.get(widget.type)!;
                        const context = quickActionContextFor(widget);
                        const actions = (definition.quickActions ?? DEFAULT_QUICK_ACTIONS).map(
                            (action) => ({ ...action, onPress: () => action.onPress(context) })
                        );
                        return (
                            <WidgetShell
                                title={definition.label}
                                editing={editing}
                                isDragOver={isDragOver}
                                isConfiguring={session.editedWidget?.id === widget.id}
                                actions={actions}
                            >
                                {renderContent(widget, editing)}
                            </WidgetShell>
                        );
                    }}
                />
            )}

            <AddWidgetSheet
                insertIndex={insertIndex}
                definitions={definitions}
                cell={cellMetrics}
                onAdd={(definition, variant, span) =>
                    insertIndex !== null &&
                    onLayoutChange(
                        insertAt(layout, createInstance(definition, variant, span), insertIndex)
                    )
                }
                onClose={() => setInsertIndex(null)}
            />

            <WidgetSettingsHost
                session={session}
                anchor={anchor}
                spotlight={
                    previewWidget ? (
                        <WidgetShell title={byType.get(previewWidget.type)!.label}>
                            {renderContent(previewWidget, false)}
                        </WidgetShell>
                    ) : null
                }
            />
        </>
    );
}
