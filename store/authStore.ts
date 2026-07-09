import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { queryClient } from "@/lib/queryClient";
import { zustandStorage } from "@/lib/zustandStorage";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    hasHydrated: boolean;
    setHasHydrated: (value: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            hasHydrated: false,

            setHasHydrated: (value) => set({ hasHydrated: value }),

            login: (token) => set({ token, isAuthenticated: true }),

            logout: () => {
                set({ token: null, isAuthenticated: false });
                queryClient.clear();
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
