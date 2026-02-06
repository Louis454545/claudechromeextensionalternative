import { db } from "@testextension/db";
import { conversation, chatMessage } from "@testextension/db/schema/chat";
import { eq, asc, sql } from "drizzle-orm";
import type { UIMessage } from "ai";

export async function getOrCreateConversation(conversationId?: string) {
  if (conversationId) {
    const existing = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });
    if (existing) return existing;
  }

  const id = conversationId ?? crypto.randomUUID();
  const [created] = await db
    .insert(conversation)
    .values({ id })
    .returning();
  return created;
}

export async function saveMessages(conversationId: string, messages: UIMessage[]) {
  if (messages.length === 0) return;

  for (const msg of messages) {
    await db
      .insert(chatMessage)
      .values({
        id: msg.id,
        conversationId,
        role: msg.role,
        parts: msg.parts,
      })
      .onConflictDoUpdate({
        target: chatMessage.id,
        set: {
          parts: sql`excluded.parts`,
          role: sql`excluded.role`,
        },
      });
  }
}

export async function getMessages(conversationId: string): Promise<UIMessage[]> {
  const rows = await db.query.chatMessage.findMany({
    where: eq(chatMessage.conversationId, conversationId),
    orderBy: [asc(chatMessage.createdAt)],
  });

  return rows.map((row) => ({
    id: row.id,
    role: row.role as UIMessage["role"],
    parts: row.parts as UIMessage["parts"],
    createdAt: row.createdAt,
  }));
}

export async function updateConversationTitle(conversationId: string, title: string) {
  await db
    .update(conversation)
    .set({ title })
    .where(eq(conversation.id, conversationId));
}
