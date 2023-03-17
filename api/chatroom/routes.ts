import { RoomType, SenderType } from "@prisma/client";
import { z } from "zod";
import { privateProcedure, router } from "@/lib/trpc";
import { chatrooms } from "./chatrooms";
import { createId } from '@paralleldrive/cuid2';


export const chatroomRouter = router({
  getChatrooms: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chatroom.findMany({
      where: {
        userId: ctx.user.id
      }
    })
  }),
  getPredefinedRooms: privateProcedure.query(async ({ ctx }) => {
    return chatrooms.map((room) => ({ ...room, id: createId(), roomType: RoomType.PreDefined }));
  }),
})

const getChatroomMessagesInput = z.object({
  chatroomId: z.string(),
  page: z.number().optional().default(1)
})

const sendMessageToChatroomInput = z.object({
  chatroomId: z.string().optional(),
  content: z.string(),
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
      const isPredefined = chatrooms.findIndex(e => e.id === chatroomId);

      // If chatroom creation changes adjust the middleware
      return ctx.prisma.message.create({
        data: {
          content,
          senderType: SenderType.User,
          User: { connect: { id: userId } },
          Chatroom: {
            ...(chatroomId ?
              { connect: { id: chatroomId } } :
              { create: { name: 'New Chat', userId, roomType: isPredefined ? RoomType.PreDefined : RoomType.Chat } })
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
});