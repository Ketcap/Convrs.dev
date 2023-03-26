import { effect, signal } from "@preact/signals-react";
import { renderMarkdown } from "../lib/renderMarkdown";
import { Message, SenderType } from "@prisma/client";
import { currentChatroom } from "./chatrooms";

export interface ChatInput extends Message {
  audio?: HTMLAudioElement;
  markdown?: string;
}

export const chatState = signal<ChatInput[]>([]);

effect(() => {
  if (!currentChatroom.value) {
    chatState.value = []
  }
})

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

export const editChatInput = async (id: string, content: string) => {
  const markdown = await renderMarkdown(content);
  chatState.value = chatState.value.map((chat) => {
    if (chat.id === id) {
      return {
        ...chat,
        content,
        markdown
      }
    }
    return chat
  });
}

export const createAudio = (voice: ArrayBuffer) => {
  const mimeType = 'audio/wav';
  const blob = new Blob([voice], { type: mimeType });
  const audioUrl = URL.createObjectURL(new Blob([blob], { type: 'audio/wav' }));
  const audio = new Audio(audioUrl);
  return audio;
}

export const addVoiceToChatInput = (id: string, voice: ArrayBuffer) => {
  const audio = createAudio(voice);
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
      ...message,
      audio: message.Voice ? createAudio(message.Voice) : undefined
    })
  })
  )
}