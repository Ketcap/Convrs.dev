import { signal } from "@preact/signals-react";
import { renderMarkdown } from "../lib/renderMarkdown";
import { Message, SenderType } from "@prisma/client";

export interface ChatInput {
  id: string;
  role: SenderType;
  content: string;
  audio?: HTMLAudioElement;
  markdown?: string;
  timestamp?: Date;
}

export const chatState = signal<ChatInput[]>([]);

export const addChatInput = async (input: ChatInput) => {
  // make each chat input a signal so we can update it later
  const markdown = await renderMarkdown(input.content);
  const chatInput = {
    ...input,
    markdown,
  }
  chatState.value = [...chatState.value, chatInput];
  return chatInput;
}

export const addVoiceToChatInput = (id: string, voice: ArrayBuffer) => {
  const audioUrl = URL.createObjectURL(new Blob([new Uint8Array(voice)]));
  const audio = new Audio(audioUrl);
  chatState.value = chatState.value.map((chat) => {
    if (chat.id === id) {
      return {
        ...chat,
        audio
      }
    }
    return chat
  })
  audio.play();
}

export const initializeChat = async (messages: Message[]) => {
  chatState.value = await Promise.all(messages.map(message => {
    return addChatInput({
      id: message.id,
      role: message.senderType,
      content: message.content,
      timestamp: message.createdAt
    })
  })
  )
}