import { db } from "$lib/server/db";
import { chats, conversations } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function createMessage(conversationId: string, message: string) {
	// await Bun.sleep(2000); // REMOVE
	console.log(await getAllMessages(conversationId)); // REMOVE
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
				messageLimit: sql`${conversations.messageCount} >= ${process.env.MESSAGE_LIMIT || 5} - 1`,
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
	// deleteAllMessage(conversationId); // REMOVE
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
// REMOVE THE WHOLE FUNCTION
export async function deleteAllMessage(conversationId: string) {
	await db.update(conversations).set({ messageCount: 0 });
	return await db.delete(chats).where(eq(chats.conversationId, conversationId));
}
