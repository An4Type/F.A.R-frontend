/* eslint-env node */
// https://docs.expo.dev/guides/using-eslint/
const fs = require("fs");
const path = require("path");

const features = fs
    .readdirSync(path.join(__dirname, "features"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

module.exports = {
    extends: ["expo", "prettier"],
    ignorePatterns: ["/dist/*"],
    rules: {
        "import/no-restricted-paths": [
            "error",
            {
                zones: [
                    {
                        target: ["./components", "./lib", "./constants"],
                        from: "./features",
                        message: "Shared code must not depend on a feature.",
                    },
                    // A feature may use another feature only through its index.ts.
                    ...features.map((feature) => ({
                        target: `./features/${feature}`,
                        from: "./features",
                        except: [
                            `./${feature}`,
                            ...features.filter((f) => f !== feature).map((f) => `./${f}/index.ts`),
                        ],
                        message: "Import other features through their index.ts.",
                    })),
                ],
            },
        ],
    },
};
