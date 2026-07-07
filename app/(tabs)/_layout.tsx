import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#89BD71",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: "#a3a3a3",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "checkbox" : "checkbox-outline"}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="(search)"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? "search" : "search-outline"} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
