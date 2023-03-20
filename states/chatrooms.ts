import { effect, signal } from "@preact/signals-react";
import { RoomType } from "@prisma/client";
import { chatState } from "./chatState";

export type CurrentChatroomId = { id: string }
export type CurrentChatroomType = { roomType: RoomType }

export const currentChatroom = signal<CurrentChatroomId | CurrentChatroomType | undefined>(undefined);

export const chatrooms = signal([])


effect(() => {
  if (!currentChatroom.value) {
    chatState.value = []
  }
})