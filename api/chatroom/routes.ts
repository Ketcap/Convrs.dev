import { RoomType, SenderType } from "@prisma/client";
import { z } from "zod";
import { privateProcedure, router } from "@/lib/trpc";
import { chatrooms, findChatroom } from "./chatrooms";


export const chatroomRouter = router({
  getChatrooms: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chatroom.findMany({
      where: {
        userId: ctx.user.id
      }
    })
  }),
  getPredefinedRooms: privateProcedure.query(async ({ ctx }) => {
    return chatrooms
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
  chatroomId: z.string().optional(),
  roomType: z.nativeEnum(RoomType).optional(),
  page: z.number().optional().default(1)
})

const sendMessageToChatroomInput = z.object({
  chatroomId: z.string().optional(),
  content: z.string(),
  roomType: z.nativeEnum(RoomType).optional()
})

export const messageRouter = router({
  getChatroomMessages: privateProcedure
    .input(getChatroomMessagesInput)
    .query(async ({ ctx, input }) => {
      const { chatroomId, roomType, page } = input;
      if (!chatroomId && !roomType) throw new Error('Either chatroomId or roomType is required');
      const limit = 50;
      return ctx.prisma.message.findMany({
        where: {
          Chatroom: {
            ...(chatroomId ? {
              userId: ctx.user.id,
              id: chatroomId
            } : { roomType: roomType, userId: ctx.user.id })
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
      const { chatroomId, content, roomType } = input;
      const userId = ctx.user.id;
      const predefinedRoom = findChatroom(roomType);
      console.log(roomType, predefinedRoom)

      // If chatroom creation changes adjust the middleware
      return ctx.prisma.message.create({
        data: {
          content,
          senderType: SenderType.User,
          User: { connect: { id: userId } },
          Chatroom: {
            ...(chatroomId ?
              { connect: { id: chatroomId } } :
              {
                create: {
                  name: 'New Chat', userId, roomType: roomType ?? RoomType.Chat, directives: {
                    set: predefinedRoom?.systemDirectives as any[] ?? []
                  }
                }
              })
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