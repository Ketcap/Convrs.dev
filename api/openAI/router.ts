import { SenderType } from "@prisma/client";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { privateProcedure, router } from "../../lib/trpc";
import { findChatroom } from "../chatroom/chatrooms";

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: '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'
  })
)


export const openAIRouter = router({
  getCompletion: privateProcedure
    .input(z.object({
      chatroomId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { chatroomId, content } = input;
      const chatroom = await ctx.prisma.chatroom.findUniqueOrThrow({
        where: {
          id: chatroomId
        }
      })
      try {
        const directives: ChatCompletionRequestMessage[] = chatroom.directives.map((directive) => ({
          content: directive,
          role: 'system',
        }));
        const completion = await openAI.createChatCompletion({
          messages: [...directives, {
            content,
            role: 'user',
            name: ctx.user.name || undefined
          }],
          model: "gpt-3.5-turbo",
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
        throw new Error((e as Error).message)
      }
    })
})