import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_LAYOUT, migrateLegacyLayout } from "@/features/widget-catalog";
import type { WidgetInstance } from "@/features/widgets";
import { zustandStorage } from "@/lib/zustandStorage";

interface LayoutState {
    layout: WidgetInstance[];
    setLayout: (layout: WidgetInstance[]) => void;
}

// The dashboard's widget layout. The widget engine never saves anything;
// it reports changes and this store persists them.
export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            layout: DEFAULT_LAYOUT,
            setLayout: (layout) => set({ layout }),
        }),
        {
            name: "widget-storage",
            version: 1,
            storage: createJSONStorage(() => zustandStorage),
            partialize: ({ layout }) => ({ layout }),
            // v0 saved `widgets` with size names instead of spans/variants.
            migrate: (persisted, version) => {
                if (version === 0) {
                    const legacy = (
                        persisted as { widgets?: Parameters<typeof migrateLegacyLayout>[0] }
                    ).widgets;
                    return { layout: legacy ? migrateLegacyLayout(legacy) : DEFAULT_LAYOUT };
                }
                return persisted as { layout: WidgetInstance[] };
            },
        }
    )
);
