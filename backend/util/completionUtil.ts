import { z } from "zod";
import { ChatCompletionRequestMessage } from "openai";
import type { Chatroom, Message, RoomFeature, SenderType } from "@prisma/client";

const roomFeatures: Record<RoomFeature, RoomFeature> = {
  'OnlyLastMessage': "OnlyLastMessage",
  "OnlyUserMessages": "OnlyUserMessages",
}

const senderTypes: Record<SenderType, SenderType> = {
  Assistant: "Assistant",
  System: "System",
  User: "User"
}

export const prepareOpenAIInput = (
  {
    RoomFeatures,
    maxToken,
    model,
    messages,
    directive
  }: Pick<Chatroom, 'RoomFeatures' | 'maxToken' | 'model' | 'directive'> & {
    messages: Pick<Message, 'content' | 'senderType'>[]
  }
) => {
  let contextMessages: ChatCompletionRequestMessage[] = [];


  if (RoomFeatures.includes(roomFeatures.OnlyLastMessage)) {
    const lastMessage = messages[messages.length - 1];
    contextMessages = [
      {
        content: lastMessage.content,
        role: lastMessage.senderType === senderTypes.User ? 'user' : 'assistant',
      }
    ]
  } else if (RoomFeatures.includes(roomFeatures.OnlyUserMessages)) {
    contextMessages = messages.filter((message) => message.senderType === senderTypes.User).map((message) => ({
      content: message.content,
      role: 'user',
    }))
  } else {
    contextMessages = messages.map((message) => ({
      content: message.content,
      role: message.senderType === senderTypes.User ? 'user' : 'assistant',
    }));
  }

  return {
    model,
    max_tokens: maxToken,
    temperature: 0.2,
    n: 1,
    messages: [
      {
        content: `${directive}`,
        role: 'system',
        name: 'System'
      },
      ...contextMessages,
    ]
  }
}

export const completionInput = z
  .object({
    model: z.string(),
    maxToken: z.number(),
    messages: z.array(
      z.object({
        content: z.string(),
        senderType: z.nativeEnum(senderTypes),
      })
    ),
    directive: z.string(),
    RoomFeatures: z.array(z.nativeEnum(roomFeatures)),
  })

