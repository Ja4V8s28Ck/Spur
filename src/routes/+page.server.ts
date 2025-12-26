import {
	createConversation,
	getConversationById,
} from "$lib/server/conversations";
import type {
	ConversationResponseError,
	ConversationResponseSuccess,
} from "$lib/types";
import { fail, type RequestEvent } from "@sveltejs/kit";

export const actions = {
	createConversation: async () => {
		try {
			const [conversation] = await createConversation();
			const conversationId = conversation.conversationId;

			return {
				action: "createConversation",
				success: true,
				conversationId,
			} satisfies ConversationResponseSuccess;
		} catch (error) {
			return fail(500, {
				action: "createConversation",
				error: "FAILED_TO_CREATE_CONVERSATION",
				detail: error instanceof Error ? error.message : "Unknown error",
			} satisfies ConversationResponseError);
		}
	},

	getConversation: async ({ request }: RequestEvent) => {
		const formData = await request.formData();
		const conversationId = formData
			.get("conversationId")
			?.toString()
			.trim()
			.toLowerCase();

		if (!conversationId) {
			return fail(400, {
				action: "getConversation",
				error: "CONVERSATION_ID_REQUIRED",
				detail: "Conversation ID not given",
			} satisfies ConversationResponseError);
		}

		const regex =
			/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
		const isValid = regex.test(conversationId);

		if (conversationId.length != 36 || !isValid) {
			return fail(400, {
				action: "getConversation",
				error: "CONVERSATION_ID_INVALID",
				detail: "Conversation ID not valid",
			} satisfies ConversationResponseError);
		}

		try {
			const data = await getConversationById(conversationId);

			if (!data) {
				return fail(404, {
					action: "getConversation",
					error: "CONVERSATION_ID_NOT_FOUND",
					detail: "Conversation id not found",
				} satisfies ConversationResponseError);
			}
			return {
				action: "getConversation",
				success: true,
				conversationId,
			} satisfies ConversationResponseSuccess;
		} catch (error) {
			return fail(500, {
				action: "getConversation",
				error: "FAILED_TO_GET_CONVERSATION",
				detail: error instanceof Error ? error.message : "Unknown error",
			} satisfies ConversationResponseError);
		}
	},
};
