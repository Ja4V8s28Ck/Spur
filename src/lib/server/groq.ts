import type { AgentResponse, Chat } from "$lib/types";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat.mjs";
import { exit } from "process";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY env not given");
  exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const XdjQRpfBOwPIRZrlvU = `
# Guidelines for generating response:
- Be friendly and professional
- Keep responses brief within 200 chars and to the point
- If you don't know something, say so
- Always refer to the store policies provided above
- Never make up information that are not in the knowledge base

# E-Commerce Store Policies

## Shipping Policy
- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days
- Free shipping on orders over $50
- International shipping available to select countries

## Return/Refund Policy
- 30-day return window from delivery date
- Items must be unused and in original packaging
- Refunds processed within 5-7 business days
- Return shipping costs are customer's responsibility unless item is defective

## Support Hours
- Monday - Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed
- Email support available 24/7 with response within 24 hours
`;

export async function generateAgentReply(
  prevMessages: Chat[],
  currUserMessage: string,
): Promise<AgentResponse> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system" as const,
        content: `You are an E-Commerce support agents. ${XdjQRpfBOwPIRZrlvU}`,
      },
      ...prevMessages.map((chat) => ({
        role: chat.isBot ? ("assistant" as const) : ("user" as const),
        content: chat.message,
      })),
      {
        role: "user" as const,
        content: currUserMessage,
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.7,
      max_tokens: 200,
    });

    const botReply =
      response.choices[0]?.message?.content ||
      "Agent couldn't generate a response.";

    return {
      botReply,
      status: 200,
      error: "OK",
      detail: "success",
    };
  } catch (error) {
    if (error instanceof Groq.APIError) {
      const { error: err } = error.error;
      console.error(error); // Log error to the server

      switch (error.status) {
        case 400:
          return {
            status: error.status,
            error: "BAD_REQUEST",
            detail: err.message,
          };

        case 401:
          return {
            status: error.status,
            error: "INVALID_API_KEY",
            detail: err.message,
          };

        case 403:
          return {
            status: error.status,
            error: "ACCESS_DENIED",
            detail: err.message,
          };

        case 404:
          return {
            status: error.status,
            error: "NOT_FOUND",
            detail: err.message,
          };

        case 429:
          return {
            status: error.status,
            error: "RATE_LIMIT_EXCEEDED",
            detail: err.message,
          };

        case 502:
          return {
            status: error.status,
            error: "BAD_GATEWAY",
            detail: err.message,
          };

        case 503:
          return {
            status: error.status,
            error: "SERVICE_UNAVAILABLE",
            detail: err.message,
          };

        default:
          return {
            status: error.status,
            error: "INTERNAL_SERVER_ERROR",
            detail: err.message,
          };
      }
    } else {
      return {
        status: 500,
        error: "INTERNAL_SERVER_ERROR",
        detail: error instanceof Error ? error.message : "Unknown agent error",
      };
    }
  }
}
