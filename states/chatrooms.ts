import { signal } from "@preact/signals-react";

export const currentChatroom = signal<string | undefined>(undefined);

export const chatrooms = signal([])