import { Application, SenderType } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import { z } from "zod";
import { privateProcedure, router, t } from "@/lib/trpc";
import { getConfigOrThrow } from "@/backend/util/config";
import { createOpenAI } from "./util";

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
  getModels: openAIProcedure
    .query(async ({ ctx }) => {
      const models = await ctx.openAI.listModels();
      if (models.status !== 200) {
        throw new Error('Error while fetching models');
      }
      return [
        'gpt-3.5-turbo', 'gpt-3.5-turbo-0301'
      ];
    }),
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
        const directive: [ChatCompletionRequestMessage] | [] = chatroom.directive ? [{
          content: chatroom.directive,
          role: 'system',
          name: 'System'
        }] : []
        const completion = await ctx.openAI.createChatCompletion({
          messages: [...directive, ...contextMessages, {
            content,
            role: 'user',
            name: ctx.user.name
          }],
          model: chatroom.model,
          temperature: 0.2,
          max_tokens: chatroom.maxTokens,
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
        console.error(e)
        throw new Error((e as Error).message)
      }
    }),
  userOpenAi: openAIProcedure
    .mutation(async ({ ctx, input }) => {
      return ctx.openAI;
    })
})