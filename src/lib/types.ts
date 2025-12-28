export type ResponseSuccess = {
	action: string;
	success: true;
	conversationId: string;
};

export type ResponseError = {
	action: string;
	error: string;
	detail: string;
};

export type Chat = {
	id: string;
	message: string;
	isBot: boolean;
};
