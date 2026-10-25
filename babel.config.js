module.exports = function (api) {
    api.cache(true);
    return {
        presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
        // Drizzle migrations are .sql files; this inline them as strings in the bundle.
        plugins: [["inline-import", { extensions: [".sql"] }]],
    };
};
