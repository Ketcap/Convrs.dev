import { RoomFeature, SenderType } from "@prisma/client";
import { z } from "zod";
import { privateProcedure, router } from "@/lib/trpc";


const createChatroomInput = z.object({
  name: z.string(),
  features: z.nativeEnum(RoomFeature).array().default([]),
  openAIModel: z.string().nonempty().default('gpt-3.5-turbo'),
  maxToken: z.number().min(1),
  directive: z.string(),
  voice: z.string().nullable(),
  voiceStability: z.number().min(0).max(1).default(0.60).nullable(),
  voiceClarity: z.number().min(0).max(1).default(0.65).nullable(),
  image: z.string().nonempty().nullable().default('ai-1.png'),
})



export const chatroomRouter = router({
  create: privateProcedure
    .input(createChatroomInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.chatroom.create({
        data: {
          name: input.name,
          RoomFeatures: {
            set: input.features
          },
          userId: ctx.user.id,
          model: input.openAIModel,
          maxToken: input.maxToken,
          directive: input.directive,
          voice: input.voice,
          voiceStability: input.voiceStability,
          voiceClarity: input.voiceClarity,
          image: input.image ?? undefined
        }
      })
    }),
  getChatroom: privateProcedure
    .input(z.object({
      chatroomId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { chatroomId } = input;
      return ctx.prisma.chatroom.findUniqueOrThrow({
        where: {
          id: chatroomId,
          userId: ctx.user.id
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
  role: z.nativeEnum(SenderType).default(SenderType.User)
})

const starMessageInput = z.object({
  messageId: z.string(),
  isFavorite: z.boolean()
})


export const messageRouter = router({
  getChatroomMessages: privateProcedure
    .input(getChatroomMessagesInput)
    .query(async ({ ctx, input }) => {
      const { chatroomId } = input;
      const limit = 50;
      return ctx.prisma.message.findMany({
        where: {
          Chatroom: {
            userId: ctx.user.id,
            id: chatroomId
          }
        },
        orderBy: [{ createdAt: 'asc' }],
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
      const { chatroomId, content, role } = input;
      const userId = ctx.user.id;


      return ctx.prisma.message.create({
        data: {
          content,
          senderType: role,
          ...(role === SenderType.User ? { User: { connect: { id: userId } } } : {}),
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