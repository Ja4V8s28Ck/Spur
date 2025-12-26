import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from ".";

try {
	migrate(db, { migrationsFolder: "./drizzle" });
	console.log("Database migration successful");
} catch (err) {
	console.error("Database migration failed\n", err);
}
