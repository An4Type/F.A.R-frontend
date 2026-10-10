import { Stack } from "expo-router";
import React from "react";

export default function SearchLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="food/[slug]" options={{ headerShown: false }} />
        </Stack>
    );
}
