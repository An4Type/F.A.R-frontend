import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/lib/zustandStorage";

interface WaterState {
    consumedMl: number;
    addWater: (ml: number) => void;
}

// Water drunk today. Goal and glass size are per-widget settings.
export const useWaterStore = create<WaterState>()(
    persist(
        (set) => ({
            consumedMl: 0,
            addWater: (ml) => set((state) => ({ consumedMl: Math.max(0, state.consumedMl + ml) })),
        }),
        {
            name: "water-storage",
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
