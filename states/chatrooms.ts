import { effect, signal } from "@preact/signals-react";
import { chatState } from "./chatState";

export const currentChatroom = signal<string | undefined>(undefined);

export const chatrooms = signal([])


effect(() => {
  if (!currentChatroom.value) {
    chatState.value = []
  }
})