import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { type ComponentProps } from "react";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarIcon } from "@/components/layout/TabBarIcon";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { colors, shadows } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; title: string; icon: IconName; activeIcon: IconName }[] = [
    { name: "index", title: "Home", icon: "home-outline", activeIcon: "home" },
    { name: "explore", title: "Explore", icon: "checkbox-outline", activeIcon: "checkbox" },
    { name: "search", title: "Search", icon: "search-outline", activeIcon: "search" },
    { name: "profile", title: "Profile", icon: "person-outline", activeIcon: "person" },
];

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarActiveTintColor: colors.tab.active,
                        tabBarInactiveTintColor: colors.tab.inactive,
                        tabBarStyle: {
                            position: "absolute",
                            height: TAB_BAR_HEIGHT,
                            backgroundColor: colors.surface.app,
                            borderTopWidth: 0,
                            boxShadow: shadows["tab-bar"],
                        },
                        tabBarItemStyle: {
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    }}
                >
                    {TABS.map((tab) => (
                        <Tabs.Screen
                            key={tab.name}
                            name={tab.name}
                            options={{
                                title: tab.title,
                                tabBarIcon: ({ color, focused }) => (
                                    <TabBarIcon
                                        name={focused ? tab.activeIcon : tab.icon}
                                        color={color}
                                        focused={focused}
                                    />
                                ),
                            }}
                        />
                    ))}
                    <Tabs.Screen name="history" options={{ href: null }} />
                </Tabs>
            </SafeAreaView>

            <View
                pointerEvents="none"
                className="absolute inset-x-0 top-0 bg-surface-hero"
                style={{ height: insets.top }}
            />
        </>
    );
}
