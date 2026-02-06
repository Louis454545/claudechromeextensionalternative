import { streamText, convertToModelMessages, type UIMessage, stepCountIs } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getAccessibilityTree } from "@testextension/api/tools/get-accessibility-tree";
import {
  getOrCreateConversation,
  saveMessages,
  updateConversationTitle,
} from "@testextension/api/chat/persistence";
import { env } from "@testextension/env/server";
import type { Context } from "hono";

const anthropic = createAnthropic({
  baseURL: env.ANTHROPIC_BASE_URL,
});

export async function chatHandler(c: Context) {
  const body = await c.req.json();
  const { messages, conversationId } = body as {
    messages: UIMessage[];
    conversationId?: string;
  };

  const conv = await getOrCreateConversation(conversationId);
  if (!conv) {
    return c.json({ error: "Failed to create conversation" }, 500);
  }

  // Save incoming user messages
  const userMessages = messages.filter(
    (m) => m.role === "user" && m.id,
  );
  if (userMessages.length > 0) {
    await saveMessages(conv.id, userMessages);
  }

  // Generate title from first user message
  if (!conv.title && userMessages.length > 0) {
    const firstMsg = userMessages[0];
    if (firstMsg) {
      const firstText = firstMsg.parts.find(
        (p: { type: string }) => p.type === "text",
      );
      if (firstText && "text" in firstText) {
        const title = (firstText.text as string).slice(0, 100);
        await updateConversationTitle(conv.id, title);
      }
    }
  }

  const convId = conv.id;

  const result = streamText({
    model: anthropic("claude-opus-4.6"),
    system:
      "You are a helpful AI assistant embedded in a browser extension. You can analyze web pages using the accessibility tree tool. Be concise and helpful.",
    messages: await convertToModelMessages(messages),
    tools: { get_accessibility_tree: getAccessibilityTree },
    stopWhen: stepCountIs(5),
    onFinish: async ({ text }) => {
      if (text) {
        const assistantMessage = {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          parts: [{ type: "text" as const, text }],
        };
        await saveMessages(convId, [assistantMessage as unknown as UIMessage]);
      }
    },
  });

  const response = result.toUIMessageStreamResponse({
    sendReasoning: true,
  });

  response.headers.set("X-Conversation-Id", convId);

  return response;
}
