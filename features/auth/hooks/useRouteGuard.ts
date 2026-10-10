import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useOnboardingStore } from "@/features/auth/store/onboardingStore";

/**
 * A custom hook to guard routes based on authentication status.
 * Provides a centralized way to redirect users to the login page if they are not authenticated.
 * This hook should be used in the root layout of the application to ensure that all routes are protected.
 * @returns void
 */
export function useRouteGuard() {
    // Using Zustand store to get the authentication and onboarding state
    const authHydrated = useAuthStore((state) => state.hasHydrated);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const onboardingHydrated = useOnboardingStore((state) => state.hasHydrated);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!authHydrated || !onboardingHydrated) {
            return;
        }

        const currentSegment: string = segments[0] ?? "";
        const inAuthGroup = currentSegment === "login";

        if (!isAuthenticated) {
            if (!inAuthGroup) {
                router.replace("/login");
            }
            return;
        }

        if (inAuthGroup) {
            router.replace("/(tabs)");
        }
    }, [authHydrated, isAuthenticated, onboardingHydrated, segments, router]);
}
