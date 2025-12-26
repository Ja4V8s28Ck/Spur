export type ConversationResponseSuccess = {
	action: string;
	success: true;
	conversationId: string;
};

export type ConversationResponseError = {
	action: string;
	error: string;
	detail: string;
};
