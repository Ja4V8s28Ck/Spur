import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { conversations } from "$lib/server/db/schema";

export async function createConversation() {
	return await db
		.insert(conversations)
		.values({})
		.returning({ conversationId: conversations.id });
}

export async function getConversationById(conversationId: string) {
	return await db.query.conversations.findFirst({
		where: eq(conversations.id, conversationId),
	});
}
