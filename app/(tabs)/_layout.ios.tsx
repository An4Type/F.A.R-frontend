import { NativeTabs } from "expo-router/unstable-native-tabs";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SF_TAB_ICONS, TABS } from "@/components/layout/tabs";
import { colors } from "@/constants/theme";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <NativeTabs tintColor={colors.tab.active} minimizeBehavior="onScrollDown">
                    {TABS.map((tab) => (
                        <NativeTabs.Trigger
                            key={tab.name}
                            name={tab.name}
                            role={tab.name === "search" ? "search" : undefined}
                        >
                            <NativeTabs.Trigger.Label>{tab.title}</NativeTabs.Trigger.Label>
                            <NativeTabs.Trigger.Icon
                                sf={{
                                    default: SF_TAB_ICONS[tab.name].icon,
                                    selected: SF_TAB_ICONS[tab.name].activeIcon,
                                }}
                            />
                        </NativeTabs.Trigger>
                    ))}
                </NativeTabs>
            </SafeAreaView>

            <View
                pointerEvents="none"
                className="absolute inset-x-0 top-0 bg-surface-hero"
                style={{ height: insets.top }}
            />
        </>
    );
}
