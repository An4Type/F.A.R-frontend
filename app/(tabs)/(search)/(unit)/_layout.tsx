import { Stack, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {

  return (
      <Stack>
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
  );
}