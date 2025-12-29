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

	const isConversationExist = await getConversationById(conversationId);

	if (!isConversationExist) {
		throw error(404, "Conversation not found");
	}

	const messages: Chat[] = await getAllMessages(conversationId);

	return {
		messages,
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
				detail: error instanceof Error ? error.message : "Unknown error",
			} as ResponseError);
		}
	},
};
