import { Application, Chatroom, ConfigType, Message, Prisma, PrismaClient } from "@prisma/client";
import { createOpenAI } from "../backend/openAI/util";

export const extendPrisma = (prisma: PrismaClient) => {
  // prisma.$use(async (params, next) => {
  //   const result = await next(params);

  //   // Query we are looking for
  //   // create Message {
  //   //   data: {
  //   //     content: "let's try to create a short poem and haiku about imagine dragons",
  //   //     senderType: 'User',
  //   //     User: { connect: [Object] },
  //   //     Chatroom: { create: [Object] }
  //   //   }
  //   // }
  //   if (
  //     params.action === 'create' &&
  //     params.model === 'Message' &&
  //     params.args?.data?.Chatroom?.create &&
  //     params.args?.data?.User?.connect.id
  //   ) {
  //     const userId = params.args?.data?.User?.connect.id as string
  //     const chatroomMessage = result as unknown as Message;
  //     const userConfig = await prisma.config.findUnique({
  //       where: {
  //         userId_application_type: {
  //           userId,
  //           application: Application.OpenAI,
  //           type: ConfigType.Key
  //         }
  //       }
  //     })
  //     if (!userConfig) return;
  //     const openAI = createOpenAI(userConfig.key);
  //     console.log(chatroomMessage)
  //     try {
  //       const response = await openAI.createChatCompletion({
  //         messages: [
  //           {
  //             content: `can you suggest a title for this following: ${chatroomMessage.content}`, role: 'user', name: 'user',

  //           }
  //         ],
  //         model: "gpt-3.5-turbo-0301", // use it from the list of models
  //       })
  //       if (!response || response['data'].choices[0].message) return;
  //       const title = response['data'].choices[0].message;
  //       console.log(title, chatroomMessage)
  //       await prisma.chatroom.update({
  //         where: {
  //           id: chatroomMessage.chatroomId
  //         },
  //         data: {
  //           name: title
  //         }
  //       })
  //     } catch (e) { console.log(e) }
  //   }
  //   return result;
  // })
  // return prisma;
}