import { db } from "$lib/server/db";
import { chats, conversations } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function createMessage(conversationId: string, message: string) {
	await db.transaction(async (trx) => {
		await trx.insert(chats).values({
			conversationId,
			message,
			isBot: false,
		});

		await trx
			.update(conversations)
			.set({
				messageCount: sql`${conversations.messageCount} + 1`,
				messageLimit: sql`${conversations.messageCount} >= ${process.env.MAX_MESSAGE_LIMIT || 5} - 1`,
			})
			.where(eq(conversations.id, conversationId));

		// TODO: Get LLM reply and add it to the conversation
		await trx.insert(chats).values({
			conversationId,
			message: "This is a bot message_" + Date.now().toString(),
			isBot: true,
		});
	});
}

export async function getAllMessages(conversationId: string) {
	return await db
		.select({
			id: chats.id,
			isBot: chats.isBot,
			message: chats.message,
		})
		.from(chats)
		.where(eq(chats.conversationId, conversationId))
		.orderBy(chats.createdAt);
}
