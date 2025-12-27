import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const conversations = sqliteTable("conversations", {
	id: text("id")
		.primaryKey()
		.$default(() => crypto.randomUUID()),
});

export const chats = sqliteTable("chats", {
	id: text("id")
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	conversationId: text("conversation_id")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	message: text("message", { length: 1024 }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$default(() => new Date()),
});
