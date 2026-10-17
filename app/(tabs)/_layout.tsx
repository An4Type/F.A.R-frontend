import { Tabs } from "expo-router";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarIcon } from "@/components/layout/TabBarIcon";
import { JS_TAB_ICONS, TABS } from "@/components/layout/tabs";
import { colors, shadows } from "@/constants/theme";

// Custom floating tab bar for Android and web; iOS uses the native bar in
// _layout.ios.tsx.
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
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                            paddingTop: 8,
                            paddingBottom: 8,
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
                                        name={
                                            focused
                                                ? JS_TAB_ICONS[tab.name].activeIcon
                                                : JS_TAB_ICONS[tab.name].icon
                                        }
                                        color={color}
                                        focused={focused}
                                    />
                                ),
                            }}
                        />
                    ))}
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
