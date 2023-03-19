import { effect, signal } from "@preact/signals-react";
import { RoomType } from "@prisma/client";
import { chatState } from "./chatState";

export const currentChatroom = signal<{ roomType: RoomType } | { id: string } | undefined>(undefined);

export const chatrooms = signal([])


effect(() => {
  if (!currentChatroom.value) {
    chatState.value = []
  }
})