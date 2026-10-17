import { router, type Href } from "expo-router";

// Goes back when there is a screen to return to, otherwise replaces the
// current screen with `fallback` — a screen opened directly (deep link,
// notification) has no history, and a bare router.back() would do nothing.
export function goBack(fallback: Href) {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
}
