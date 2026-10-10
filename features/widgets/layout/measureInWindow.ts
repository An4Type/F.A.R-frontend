import type { RefObject } from "react";
import type { View } from "react-native";

// A view's top-left in window coordinates. Call from event handlers, not
// during render.
export function measureInWindow(ref: RefObject<View>) {
    return new Promise<{ x: number; y: number }>((resolve) => {
        if (!ref.current) return resolve({ x: 0, y: 0 });
        ref.current.measureInWindow((x, y) => resolve({ x, y }));
    });
}
