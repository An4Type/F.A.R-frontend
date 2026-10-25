import { defineConfig } from "drizzle-kit";

// Generates SQLite migrations for the on-device database from lib/db/schema.
// After schema is changed it is required to run `npm run db:generate`.
export default defineConfig({
    dialect: "sqlite",
    driver: "expo",
    schema: "./lib/db/schema/index.ts",
    out: "./lib/db/migrations",
});
