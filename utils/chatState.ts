import { signal } from "@preact/signals-react";
import { createId } from "@paralleldrive/cuid2";

export interface ChatInput {
  id: string;
  // state: 'sent' | 'received' | 'error';
  role: "system" | "user" | "assistant";
  content: string;
  audio?: HTMLAudioElement;
}

export const chatState = signal<ChatInput[]>([].flatMap(e => [e, e, e]));

export const addChatInput = (input: Omit<ChatInput, 'id'>) => {
  // make each chat input a signal so we can update it later
  const chatInput = {
    id: createId(),
    ...input
  }
  chatState.value = [...chatState.value, chatInput];
  return chatInput;
}