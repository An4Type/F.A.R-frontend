const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Drizzle migrations are imported as .sql files (inlined by babel).
config.resolver.sourceExts.push("sql");

// expo-sqlite on web runs SQLite as WebAssembly in a worker.
config.resolver.assetExts.push("wasm");

// The web worker needs SharedArrayBuffer, which browsers only allow on
// cross-origin isolated pages. These headers cover the dev server; a hosted
// web build needs the same two headers from its server.
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    middleware(req, res, next);
};

module.exports = withNativeWind(config, { input: "./global.css" });
