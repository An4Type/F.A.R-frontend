import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/lib/zustandStorage";

interface OnboardingState {
    hasOnboarded: boolean;
    hasHydrated: boolean;
    setHasHydrated: (value: boolean) => void;
    completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            hasOnboarded: false,
            hasHydrated: false,

            setHasHydrated: (value) => set({ hasHydrated: value }),

            completeOnboarding: () => set({ hasOnboarded: true }),
        }),
        {
            name: "onboarding-storage",
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({ hasOnboarded: state.hasOnboarded }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
