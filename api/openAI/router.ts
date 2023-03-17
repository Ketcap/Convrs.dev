import { Application, SenderType } from "@prisma/client";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { privateProcedure, router } from "@/lib/trpc";
import { getConfigOrThrow } from "@/api/util/config";
import { createOpenAI } from "./util";


export const openAIRouter = router({
  getCompletion: privateProcedure
    .input(z.object({
      chatroomId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { chatroomId, content } = input;
      const config = await getConfigOrThrow(ctx.user, Application.OpenAI);
      const openAI = createOpenAI(config.key);
      const chatroom = await ctx.prisma.chatroom.findUniqueOrThrow({
        where: {
          id: chatroomId
        },
        include: {
          Messages: {
            orderBy: [{ createdAt: 'asc' }],
            take: 20
          }
        }
      })
      try {
        const directives: ChatCompletionRequestMessage[] = chatroom.directives.map((directive) => ({
          content: directive,
          role: 'system',
        }));
        const contextMessages: ChatCompletionRequestMessage[] = chatroom.Messages.map((message) => ({
          content: message.content,
          role: message.senderType as ChatCompletionRequestMessageRoleEnum,
          name: message.senderType === SenderType.User ? ctx.user.name : 'assistant'
        }));
        const completion = await openAI.createChatCompletion({
          messages: [...directives, ...contextMessages, {
            content,
            role: 'user',
            name: ctx.user.name || undefined
          }],
          model: "gpt-3.5-turbo-0301", // use it from the list of models
          temperature: 0.7,
          max_tokens: 250,
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
        console.log(JSON.stringify(e));
        throw new Error((e as Error).message)
      }
    })
})