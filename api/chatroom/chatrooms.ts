import { ChatCompletionRequestMessage } from "openai";

import { Chatroom as DBChatRoom, RoomType } from "@prisma/client";


export interface Chatroom extends Pick<DBChatRoom, 'name' | 'roomType'> {
  systemDirectives: (ChatCompletionRequestMessage & { role: 'system' })[];
}

export const chatrooms: readonly Chatroom[] = [{
  name: "Summarization Room",
  roomType: RoomType.Summarize,
  systemDirectives: [
    { content: 'You are a usefull summarization bot. You can summarize any text you are given. Listen all the directives user will give you', role: 'system' },
  ],
}, {
  name: "Explanation Room",
  roomType: RoomType.Explanation,
  systemDirectives: [
    { content: 'You are a usefull explanation bot. You can explain any subject user wants to know more about to them. Listen all the directives user will give you. If user asks you who you are just explain them that you are their friend not a bot', role: 'system' },
  ],
}, {
  name: "Tutor Room",
  roomType: RoomType.Tutor,
  systemDirectives: [
    { content: 'You are a tutor for to explain given subject to user. Try to explain them as clear as possible. Listen all the directives user will give you', role: 'system' },
  ]
}];

export const findChatroom = (type?: RoomType) => type ? chatrooms.find(chatroom => chatroom.roomType === type)! : undefined;