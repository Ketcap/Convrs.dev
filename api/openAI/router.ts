import { Application, SenderType } from "@prisma/client";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { privateProcedure, router, t } from "@/lib/trpc";
import { getConfigOrThrow } from "@/api/util/config";
import { createOpenAI, createStream } from "./util";

const openAIProcedure = privateProcedure.use(async ({ next, ctx }) => {
  try {
    const config = await getConfigOrThrow(ctx.user, Application.OpenAI);
    return next({
      ctx: {
        ...ctx,
        openAI: createOpenAI(config.key)
      }
    });
  }
  catch (e) {
    throw new Error('Not Authenticated');
  }
});

export const openAIRouter = router({
  getCompletion: openAIProcedure
    .input(z.object({
      chatroomId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { chatroomId, content } = input;
      const chatroom = await ctx.prisma.chatroom.findUniqueOrThrow({
        where: {
          id: chatroomId
        },
        include: {
          Messages: {
            orderBy: [{ createdAt: 'asc' }],
            take: 50
          }
        }
      })
      try {
        const contextMessages: ChatCompletionRequestMessage[] = chatroom.Messages.map((message) => ({
          content: message.content,
          role: message.senderType === SenderType.User ? 'user' : 'assistant',
          name: message.senderType === SenderType.User ? ctx.user.name : 'assistant'
        }));
        const completion = await ctx.openAI.createChatCompletion({
          messages: [...(chatroom.directives as any[]), ...contextMessages, {
            content,
            role: 'user',
            name: ctx.user.name || undefined
          }],
          model: "gpt-3.5-turbo-0301", // use it from the list of models
          temperature: 0.2,
          max_tokens: 250,
          // stream: true
          // responseType: 'stream'
        })

        if (completion.data.choices.length === 0) {
          throw new Error("No response found");
        }

        const response = completion.data.choices[0].message
        return ctx.prisma.message.create({
          data: {
            content: response!.content,
            senderType: SenderType.Assistant,
            Chatroom: {
              connect: {
                id: chatroomId
              }
            },
          }
        });

      } catch (e) {
        throw new Error((e as Error).message)
      }
    }),
  userOpenAi: openAIProcedure
    .mutation(async ({ ctx, input }) => {
      return ctx.openAI;
    })
})