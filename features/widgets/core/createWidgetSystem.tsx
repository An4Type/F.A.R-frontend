import {
    WidgetBoard,
    type AnyWidgetDefinition,
    type WidgetBoardProps,
} from "@/features/widgets/board/WidgetBoard";
import type { SourceMap, WidgetDefinition } from "@/features/widgets/core/types";

interface WidgetSystemConfig<Sources extends SourceMap> {
    // Every data source widgets may read, keyed by name. Map is fixed for the
    // system's lifetime: the board calls each hook once per render.
    sources: Sources;
    widgets: WidgetDefinition<any, any, Sources>[];
}

// Binds a set of data sources and widget definitions into a board component.
export function createWidgetSystem<Sources extends SourceMap>({
    sources,
    widgets,
}: WidgetSystemConfig<Sources>) {
    const definitions = widgets as AnyWidgetDefinition[];
    const byType = new Map(definitions.map((d) => [d.type, d]));

    function Board(props: WidgetBoardProps) {
        return <WidgetBoard sources={sources} definitions={definitions} {...props} />;
    }

    return {
        Board,
        definitions,
        definitionOf: (type: string) => byType.get(type),
    };
}
