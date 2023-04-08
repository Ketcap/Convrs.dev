import { Text } from "@mantine/core";
import { Chatroom } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";

import { Button } from "./Button";

import { trpc } from "@/lib/trpcClient";
import { currentChatroom } from "@/states/chatrooms";
import { useRouter } from "next/router";

export interface ChatRoomItemProps {
  chatroom: Chatroom;
}

export const ChatRoomItem = ({ chatroom }: ChatRoomItemProps) => {
  const router = useRouter();
  const isActive = currentChatroom.value?.id === chatroom.id;
  const { refetch } = trpc.chatroom.getChatrooms.useQuery(undefined, {});
  const { mutateAsync } = trpc.chatroom.deleteChatroom.useMutation({
    onSuccess: () => {
      refetch();
      if (isActive) {
        currentChatroom.value = undefined;
        router.push("/");
      }
    },
  });
  return (
    <Button
      onClick={() => {
        currentChatroom.value = chatroom;
        router.push("/r/[id]", `/r/${chatroom.id}`);
      }}
      right={
        <IconTrash
          color="#ECECF1"
          onClick={() => {
            mutateAsync({ chatroomId: chatroom.id });
            if (isActive) {
              currentChatroom.value = undefined;
            }
          }}
        />
      }
    >
      <Text color="#ECECF1">{chatroom.name}</Text>
    </Button>
  );
};
