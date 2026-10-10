import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IconName } from "@/features/food/types";
import { zustandStorage } from "@/lib/zustandStorage";

export interface MealGroup {
    id: string;
    name: string;
    icon: IconName;
    // Not wired to real food logging yet — there's no "assign a group" step
    // in the logging flow, so this only moves via manual edits for now.
    consumed: number;
    goal: number;
    reminder?: string;
}

export type MealGroupInput = Omit<MealGroup, "id" | "consumed">;

const DEFAULT_GROUPS: MealGroup[] = [
    { id: "c-breakfast", name: "Breakfast", icon: "cafe-outline", consumed: 0, goal: 600 },
    { id: "c-lunch", name: "Lunch", icon: "restaurant-outline", consumed: 0, goal: 900 },
    { id: "c-dinner", name: "Dinner", icon: "moon-outline", consumed: 0, goal: 1200 },
    { id: "c-snacks", name: "Snacks", icon: "ice-cream-outline", consumed: 0, goal: 400 },
    { id: "c-supper", name: "Supper", icon: "wine-outline", consumed: 0, goal: 300 },
];

interface MealGroupState {
    groups: MealGroup[];
    addGroup: (group: MealGroupInput) => void;
    updateGroup: (id: string, updates: Partial<MealGroupInput>) => void;
    deleteGroup: (id: string) => void;
}

export const useMealGroupStore = create<MealGroupState>()(
    persist(
        (set) => ({
            groups: DEFAULT_GROUPS,

            addGroup: (group) =>
                set((state) => ({
                    groups: [
                        ...state.groups,
                        {
                            ...group,
                            id: `c-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6)}`,
                            consumed: 0,
                        },
                    ],
                })),

            updateGroup: (id, updates) =>
                set((state) => ({
                    groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
                })),

            deleteGroup: (id) =>
                set((state) => ({ groups: state.groups.filter((g) => g.id !== id) })),
        }),
        {
            name: "meal-group-storage",
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
