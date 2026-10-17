import type Ionicons from "@expo/vector-icons/Ionicons";
import type { SFSymbolIcon } from "expo-router/unstable-native-tabs";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];
type SFSymbol = Extract<NonNullable<SFSymbolIcon["sf"]>, string>;

export interface TabDefinition {
    name: string;
    title: string;
}

export interface TabIcons<Icon> {
    icon: Icon;
    activeIcon: Icon;
}

// Is shared both with ios and android tab layout in order to draw tabs in same order
// in order to reuse it in icon definition types per platform it should be const and
// satisfy TabDefinition[] type
export const TABS = [
    { name: "index", title: "Home" },
    { name: "explore", title: "Explore" },
    { name: "search", title: "Search" },
    { name: "profile", title: "Profile" },
] as const satisfies readonly TabDefinition[];

export type TabName = (typeof TABS)[number]["name"];

export const JS_TAB_ICONS: Record<TabName, TabIcons<IconName>> = {
    index: { icon: "home-outline", activeIcon: "home" },
    explore: { icon: "checkbox-outline", activeIcon: "checkbox" },
    search: { icon: "search-outline", activeIcon: "search" },
    profile: { icon: "person-outline", activeIcon: "person" },
};

export const SF_TAB_ICONS: Record<TabName, TabIcons<SFSymbol>> = {
    index: { icon: "house", activeIcon: "house.fill" },
    explore: { icon: "checkmark.square", activeIcon: "checkmark.square.fill" },
    search: { icon: "magnifyingglass", activeIcon: "magnifyingglass" },
    profile: { icon: "person", activeIcon: "person.fill" },
};
