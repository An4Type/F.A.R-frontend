import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "An4Type",
    slug: "An4Type",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        package: "com.An4Type.AnyMeal",
    },
    web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        [
            "expo-build-properties",
            {
                android: {
                    usesCleartextTraffic: true,
                },
            },
        ],
        "expo-font",
        "expo-asset",
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        apiUrl: process.env.API_URL,
        router: {
            origin: false,
        },
        eas: {
            projectId: "9518b6fe-96b8-4882-b1bf-32bfcb6ee28f",
        },
    },
});
