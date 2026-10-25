import { QueryClientProvider } from "@tanstack/react-query";
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import "@/global.css";
import "@/lib/nativewindInterop";

import { BlurTargetProvider } from "@/components/ui/BlurTarget";
import { PortalProvider } from "@/components/ui/Portal";
import { colors } from "@/constants/theme";
import { useRouteGuard } from "@/features/auth";
import { useDatabase } from "@/lib/db/useDatabase";
import { queryClient } from "@/lib/queryClient";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// React Navigation theme with app custom background color
const navigationTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.surface.app },
};

function RootNavigator() {
    useRouteGuard();

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="history" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default function RootLayout() {
    // Load fonts before rendering the app. Should be defined like so due to NativeWind's lack of support for font loading
    // ! Namings are poor needs to be reviewed in future
    const [loaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
    });

    // Migrate the device database before any screen can read it.
    const database = useDatabase();
    const databaseSettled = database.ready || database.error !== undefined;

    useEffect(() => {
        // Placeholder for failed migrations as for now nothing is using database
        if (database.error) console.error("Database migration failed:", database.error);
    }, [database.error]);

    useEffect(() => {
        if (loaded && databaseSettled) {
            SplashScreen.hideAsync();
        }
    }, [loaded, databaseSettled]);

    if (!loaded || !databaseSettled) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider statusBarTranslucent navigationBarTranslucent preserveEdgeToEdge>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider value={navigationTheme}>
                        <PortalProvider>
                            <BlurTargetProvider>
                                <RootNavigator />
                            </BlurTargetProvider>
                        </PortalProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </KeyboardProvider>
        </GestureHandlerRootView>
    );
}
