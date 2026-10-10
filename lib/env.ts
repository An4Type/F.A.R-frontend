// EXPO_PUBLIC_USE_MOCK_API=true routes every feature's API (food + auth)
// through in-memory mocks, so the app is fully click-through-able without a
// backend running. Each feature's api/index.ts picks its implementation.
export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === "true";
