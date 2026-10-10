import type { QuickAction } from "@/features/widgets/core/types";

export const settingsAction: QuickAction = {
    key: "settings",
    icon: "settings-outline",
    onPress: ({ openSettings }) => openSettings(),
};

// Steps through the spans the current variant allows; never switches variant.
export const cycleSpanAction: QuickAction = {
    key: "cycle-span",
    icon: "resize-outline",
    onPress: ({ cycleSpan }) => cycleSpan(),
};

export const removeAction: QuickAction = {
    key: "remove",
    icon: "close",
    tone: "danger",
    onPress: ({ remove }) => remove(),
};

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [settingsAction, cycleSpanAction, removeAction];
