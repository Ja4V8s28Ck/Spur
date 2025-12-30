import { createMessage, getAllMessages } from "$lib/server/chats";
import { error, fail, type RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Chat, ResponseError } from "$lib/types";
import { getConversationById } from "$lib/server/conversations";
import { isValidUUID } from "$lib/utils";

export const load: PageServerLoad = async ({ params }) => {
	const conversationId = params?.slug;

	if (!isValidUUID(conversationId)) {
		throw error(400, "Conversation ID invalid");
	}

	const conversation = await getConversationById(conversationId);
	if (!conversation) {
		throw error(404, "Conversation not found");
	}

	const messages: Chat[] = await getAllMessages(conversation.id);

	return {
		messages,
		messagesCount: conversation.messageCount,
		messageLimit: conversation.messageLimit,
	};
};

export const actions = {
	sendMessage: async ({ params, request }: RequestEvent) => {
		const formData = await request.formData();

		const conversationId = params?.slug;

		if (!conversationId) {
			return fail(400, {
				action: "sendMessage",
				error: "CONVERSATION_ID_REQUIRED",
				detail: "Conversation ID not given",
			} as ResponseError);
		}

		const message = formData.get("message")?.toString().trim();

		if (!message) {
			return fail(400, {
				action: "sendMessage",
				error: "MESSAGE_REQUIRED",
				detail: "Message cannot be empty",
			} as ResponseError);
		}

		if (
			message.length > Number(import.meta.env.VITE_MAX_MESSAGE_LENGTH || 200)
		) {
			return fail(400, {
				action: "sendMessage",
				error: "MESSAGE_TOO_LONG",
				detail: "Message is too long",
			} as ResponseError);
		}

		const conversation = await getConversationById(conversationId);

		if (conversation?.messageLimit) {
			return fail(403, {
				action: "sendMessage",
				error: "MESSAGE_LIMIT_REACHED",
				detail: "Message limit reached, start a new conversation",
			} as ResponseError);
		}

		try {
			await createMessage(conversationId, message);
			return {
				action: "sendMessage",
				success: true,
			};
		} catch (error) {
			return fail(500, {
				action: "sendMessage",
				error: "FAILED_TO_SEND_MESSAGE",
				// @ts-expect-error no error type
				detail: error?.message || error?.body?.message || "Unknown error",
			} as ResponseError);
		}
	},
};
