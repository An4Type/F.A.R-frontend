// Source of truth for all colors and shadows used in the app. These are referenced in
// NativeWind className strings, so they must be kept in sync with tailwind.config.js.
const colors = {
    green: {
        50: "#eef7e9",
        100: "#ddefd3",
        200: "#c3e2b0",
        300: "#a4d18a",
        400: "#a4d18a",
        500: "#89bd71",
        600: "#6fa25a",
        700: "#578246",
        800: "#416330",
    },
    macro: {
        carbs: "#89d381",
        "carbs-dark": "#4f9e46",
        protein: "#f7a2bd",
        "protein-dark": "#d5537c",
        fat: "#ffd978",
        "fat-dark": "#d9a419",
        water: "#83c6ea",
        "water-dark": "#3f84ab",
    },
    accent: {
        orange: "#e8853d",
    },
    gray: {
        50: "#f8f8f8",
        75: "#f0f0f0",
        100: "#ededed",
        150: "#e8e8e8",
        200: "#e0e0e0",
        300: "#c8c8c8",
        400: "#a3a3a3",
        500: "#687076",
        600: "#555555",
        700: "#4a4a4a",
        800: "#333333",
        900: "#2e2e2e",
    },
    surface: {
        app: "#ffffff",
        hero: "#89bd71",
        "hero-mid": "#8fbd80",
        dark: "#1c1c1c",
        card: "#ffffff",
        subtle: "#f0f0f0",
        "subtle-2": "#f8f8f8",
        pill: "#e8e8e8",
        overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
        "on-brand": "#ffffff",
        "on-brand-muted": "#ededed",
        primary: "#2e2e2e",
        secondary: "#555555",
        tertiary: "#a3a3a3",
        body: "#333333",
    },
    border: {
        DEFAULT: "#e0e0e0",
        input: "#a3a3a3",
    },
    action: {
        primary: "#89bd71",
        "primary-hover": "#6fa25a",
        "primary-active": "#578246",
        "primary-tint": "#eef7e9",
        danger: "#d33c3c",
    },
    tab: {
        active: "#89bd71",
        inactive: "#a3a3a3",
    },
};

const shadows = {
    xs: "0 1px 2px rgba(46, 46, 46, 0.06)",
    sm: "0 2px 6px rgba(46, 46, 46, 0.07)",
    md: "0 6px 16px rgba(46, 46, 46, 0.08)",
    lg: "0 16px 32px rgba(46, 46, 46, 0.12)",
    brand: "0 8px 20px rgba(137, 189, 113, 0.35)",
    card: "0 2px 2px rgba(0, 0, 0, 0.15)",
    "tab-bar": "0 -4px 16px rgba(46, 46, 46, 0.06)",
};

module.exports = { colors, shadows };
