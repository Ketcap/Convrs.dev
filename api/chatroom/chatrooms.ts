import { ChatCompletionRequestMessage } from "openai";

export enum ChatroomType {
  Summarize = 'Summarize',
  Explanation = 'Explanation',
  Tutor = 'Tutor'
}

export const availableChatroomTypes = [ChatroomType.Summarize, ChatroomType.Explanation, ChatroomType.Tutor] as const;

export interface Chatroom {
  id: string;
  name: string;
  type: ChatroomType;
  systemDirectives: (ChatCompletionRequestMessage & { role: 'system' })[];
}

export const chatrooms: readonly Chatroom[] = [{
  name: "Summarization Room",
  type: ChatroomType.Summarize,
  id: ChatroomType.Summarize,
  systemDirectives: [
    { content: 'You are a usefull summarization bot. You can summarize any text you are given. Listen all the directives user will give you', role: 'system' },
  ],
}, {
  name: "Explanation Room",
  type: ChatroomType.Explanation,
  id: ChatroomType.Explanation,
  systemDirectives: [
    { content: 'You are a usefull explanation bot. You can explain any subject user wants to know more about to them. Listen all the directives user will give you. If user asks you who you are just explain them that you are their friend not a bot', role: 'system' },
  ],
}, {
  name: "Summarization Room",
  type: ChatroomType.Tutor,
  id: ChatroomType.Tutor,
  systemDirectives: [
    { content: 'You are a tutor for to explain given subject to user. Try to explain them as clear as possible. Listen all the directives user will give you', role: 'system' },
  ]
}];

export const findChatroom = (type: ChatroomType) => chatrooms.find(chatroom => chatroom.type === type)!;