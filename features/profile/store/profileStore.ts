import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/lib/zustandStorage";

export type Units = "Grams" | "Ounces";

interface ProfileState {
    caloriesGoal: number;
    units: Units;
    remindersEnabled: boolean;
    setCaloriesGoal: (goal: number) => void;
    setUnits: (units: Units) => void;
    setRemindersEnabled: (enabled: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            caloriesGoal: 4500,
            units: "Grams",
            remindersEnabled: false,

            setCaloriesGoal: (caloriesGoal) => set({ caloriesGoal }),
            setUnits: (units) => set({ units }),
            setRemindersEnabled: (remindersEnabled) => set({ remindersEnabled }),
        }),
        {
            name: "profile-storage",
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
