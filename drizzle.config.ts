import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./auth-schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "sqlite.db",
    },
});
