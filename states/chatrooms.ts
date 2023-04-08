import { signal } from "@preact/signals-react";
import { Chatroom } from "@prisma/client";

export const currentChatroom = signal<Chatroom | undefined>(undefined);
