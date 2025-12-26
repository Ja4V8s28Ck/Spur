import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { env, exit } from "process";
import * as schema from "./schema";

const databaseURL = env.DATABASE_URL;
if (!databaseURL) {
	console.error("DATABASE_URL env is not given");
	exit(1);
}
const sqlite = new Database(databaseURL);
export const db = drizzle(sqlite, {
	schema: schema,
});
console.log("Database initialized successfully");
