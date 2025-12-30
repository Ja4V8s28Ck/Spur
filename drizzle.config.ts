import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "src/lib/server/db/schema.ts",
	dbCredentials: {
		url: process.env.VITE_DATABASE_URL as string,
	},
});
