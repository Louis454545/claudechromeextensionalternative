import { z } from "zod";
import { publicProcedure, router } from "../index";
import { getMessages } from "../chat/persistence";
import { db } from "@testextension/db";
import { conversation } from "@testextension/db/schema/chat";
import { eq, desc } from "drizzle-orm";

export const chatRouter = router({
  conversations: publicProcedure.query(async () => {
    return db.query.conversation.findMany({
      orderBy: [desc(conversation.updatedAt)],
    });
  }),

  messages: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      return getMessages(input.conversationId);
    }),

  deleteConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(conversation)
        .where(eq(conversation.id, input.conversationId));
      return { success: true };
    }),
});
