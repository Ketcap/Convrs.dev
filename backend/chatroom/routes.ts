import { SenderType } from "@prisma/client";
import { z } from "zod";
import { privateProcedure, router } from "@/lib/trpc";


const createChatroomInput = z.object({
  name: z.string(),
  openAIModel: z.string().default('gpt-3.5-turbo'),
  directive: z.string(),
  voice: z.string().nullable(),
  voiceStability: z.number().min(0).max(1).default(0.60).nullable(),
  voiceClarity: z.number().min(0).max(1).default(0.65).nullable(),
})



export const chatroomRouter = router({
  create: privateProcedure
    .input(createChatroomInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.chatroom.create({
        data: {
          name: input.name,
          userId: ctx.user.id,
          voice: input.voice,
          directive: input.directive,
          model: input.openAIModel,
          voiceStability: input.voiceStability,
          voiceClarity: input.voiceClarity,
        }
      })
    }),
  getChatrooms: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chatroom.findMany({
      where: {
        userId: ctx.user.id
      }
    })
  }),
  deleteChatroom: privateProcedure
    .input(z.object({
      chatroomId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { chatroomId } = input;
      return ctx.prisma.chatroom.delete({
        where: {
          id: chatroomId,
          userId: ctx.user.id
        }
      })
    }),
})

const getChatroomMessagesInput = z.object({
  chatroomId: z.string(),
  page: z.number().optional().default(1)
})

const sendMessageToChatroomInput = z.object({
  chatroomId: z.string(),
  content: z.string(),
})

const starMessageInput = z.object({
  messageId: z.string(),
  isFavorite: z.boolean()
})


export const messageRouter = router({
  getChatroomMessages: privateProcedure
    .input(getChatroomMessagesInput)
    .query(async ({ ctx, input }) => {
      const { chatroomId, page } = input;
      const limit = 50;
      return ctx.prisma.message.findMany({
        where: {
          Chatroom: {
            userId: ctx.user.id,
            id: chatroomId
          }
        },
        take: limit,
        orderBy: [{ createdAt: 'asc' }],
        ...(page && ({ skip: (page - 1) * limit }))
      })
    }),
  /**
   * This is a mutation that creates a new message in the database.
   * Used by only from users
   * 
   */
  sendMessageToChatroom: privateProcedure
    .input(sendMessageToChatroomInput)
    .mutation(async ({ ctx, input }) => {
      const { chatroomId, content } = input;
      const userId = ctx.user.id;


      return ctx.prisma.message.create({
        data: {
          content,
          senderType: SenderType.User,
          User: { connect: { id: userId } },
          Chatroom: {
            connect: { id: chatroomId }
          }
        }
      })
    }),
  addVoiceToMessage: privateProcedure
    .input(
      z.object({
        messageId: z.string(),
        voice: z.any()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { messageId, voice } = input;
      return ctx.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          Voice: voice as Buffer
        }
      })
    })
  ,
  starMessage: privateProcedure
    .input(starMessageInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          isFavorite: input.isFavorite
        }
      })
    }
    )
});