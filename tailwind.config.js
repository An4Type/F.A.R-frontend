/** @type {import('tailwindcss').Config} */
const { colors, shadows } = require("./constants/theme");

module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./features/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors,
            spacing: {
                "3xs": "4px",
                "2xs": "8px",
                xs: "10px",
                sm: "12px",
                md: "16px",
                lg: "18px",
                xl: "20px",
                "2xl": "24px",
                "3xl": "30px",
                "4xl": "40px",
                "5xl": "50px",
            },
            borderRadius: {
                xs: "8px",
                sm: "5px",
                md: "10px",
                card: "16px",
                lg: "20px",
                xl: "30px",
                "2xl": "35px",
                pill: "999px",
            },
            fontSize: {
                "2xs": "13px",
                xs: "15px",
                sm: "16px",
                md: "18px",
                lg: "20px",
                xl: "24px",
                "2xl": "32px",
                "3xl": "40px",
                "4xl": "48px",
                "5xl": "56px",
            },
            fontWeight: {
                black: "800",
            },
            // Each weight is its own static font (see app/_layout.tsx) under
            // its own family name — React Native's native fontFamily style
            // has no fallback-stack concept, so only the first array entry
            // is ever used on native, and it must be a font that's actually
            // loaded. Use font-body-medium/-semibold/-bold or
            // font-display-medium/-semibold/-bold instead of pairing
            // font-body/font-display with font-medium/font-semibold/font-bold.
            fontFamily: {
                display: ["PlusJakartaSans_400Regular"],
                "display-medium": ["PlusJakartaSans_500Medium"],
                "display-semibold": ["PlusJakartaSans_600SemiBold"],
                "display-bold": ["PlusJakartaSans_700Bold"],
                body: ["Inter_400Regular"],
                "body-medium": ["Inter_500Medium"],
                "body-semibold": ["Inter_600SemiBold"],
                "body-bold": ["Inter_700Bold"],
            },
            boxShadow: shadows,
        },
    },
    plugins: [],
};
