import { ActionIcon, Group, Text, UnstyledButton } from "@mantine/core";
import { Chatroom } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { trpc } from "../../lib/trpcClient";
import { currentChatroom } from "../../states/chatrooms";
import { AIAvatar } from "../AIAvatar";

export interface ChatRoomItemProps {
  imageSrc?: string;
  chatroom: Chatroom;
}

export const ChatRoomItem = ({ imageSrc, chatroom }: ChatRoomItemProps) => {
  const isActive = currentChatroom.value?.id === chatroom.id;
  const { refetch } = trpc.chatroom.getChatrooms.useQuery(undefined, {});
  const { mutateAsync } = trpc.chatroom.deleteChatroom.useMutation({
    onSuccess: () => {
      refetch();
      currentChatroom.value = undefined;
    },
  });
  return (
    <Group position="apart">
      <UnstyledButton
        sx={{
          background: isActive ? "#f2f2f7" : "transparent",
          ":hover": {
            background: "#f2f2f7",
          },
          padding: 4,
          flex: 1,
        }}
        onClick={() => {
          currentChatroom.value = chatroom;
        }}
      >
        <Group>
          {imageSrc && <AIAvatar src={imageSrc} />}
          <Text>{chatroom.name}</Text>
        </Group>
      </UnstyledButton>
      <ActionIcon
        onClick={() => {
          mutateAsync({ chatroomId: chatroom.id });
          if (isActive) {
            currentChatroom.value = undefined;
          }
        }}
      >
        <IconTrash />
      </ActionIcon>
    </Group>
  );
};
