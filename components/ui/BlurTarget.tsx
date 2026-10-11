import { BlurTargetView } from "expo-blur";
import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import type { View } from "react-native";

const BlurTargetContext = createContext<RefObject<View | null> | null>(null);

// Wraps the app in the view that BlurViews blur. Android's blur needs an
// explicit target to render from (iOS and web blur whatever is behind and
// ignore it), so one target at the root serves every modal backdrop.
export function BlurTargetProvider({ children }: { children: ReactNode }) {
    const targetRef = useRef<View>(null);
    return (
        <BlurTargetContext.Provider value={targetRef}>
            <BlurTargetView ref={targetRef} style={{ flex: 1 }}>
                {children}
            </BlurTargetView>
        </BlurTargetContext.Provider>
    );
}

// Pass the result as a BlurView's `blurTarget`.
export function useBlurTarget() {
    return useContext(BlurTargetContext) ?? undefined;
}
