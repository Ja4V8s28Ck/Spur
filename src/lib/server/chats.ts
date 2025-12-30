import { db } from "$lib/server/db";
import { chats, conversations } from "$lib/server/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { generateAgentReply } from "./groq";
import { error } from "@sveltejs/kit";
import type { AgentResponse } from "$lib/types";

export async function createMessage(conversationId: string, message: string) {
	const prevMessages = await getAllMessages(conversationId, false, 6);
	const response: AgentResponse = await generateAgentReply(
		prevMessages,
		message,
	);
	if (!response?.botReply) {
		throw error(response.status, {
			message: response.detail,
		});
	}

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
				messageLimit: sql`${conversations.messageCount} >= ${import.meta.env.VITE_MAX_MESSAGE_LIMIT || 5} - 1`,
			})
			.where(eq(conversations.id, conversationId));

		await trx.insert(chats).values({
			conversationId: conversationId,
			message: response.botReply as string,
			isBot: true,
		});
	});
}

export async function getAllMessages(
	conversationId: string,
	isAsc: boolean = true,
	limit: number = -1,
) {
	const order = isAsc ? asc : desc;
	return await db
		.select({
			id: chats.id,
			isBot: chats.isBot,
			message: chats.message,
		})
		.from(chats)
		.where(eq(chats.conversationId, conversationId))
		.orderBy(order(chats.createdAt))
		.limit(limit);
}
