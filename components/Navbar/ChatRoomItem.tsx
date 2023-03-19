import { ActionIcon, Group, Text, UnstyledButton } from "@mantine/core";
import { Chatroom } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { trpc } from "../../lib/trpcClient";
import { currentChatroom } from "../../states/chatrooms";
import { AIAvatar } from "../AIAvatar";

export interface ChatRoomItemProps extends Pick<Chatroom, "name" | "roomType"> {
  id?: string;
  imageSrc?: string;
}

export const ChatRoomItem = ({
  imageSrc,
  name,
  id,
  roomType,
}: ChatRoomItemProps) => {
  const { refetch } = trpc.chatroom.getChatrooms.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const { mutateAsync } = trpc.chatroom.deleteChatroom.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  return (
    <UnstyledButton
      sx={{ ":hover": { background: "#f2f2f7" }, padding: 4 }}
      onClick={() => {
        if (id) currentChatroom.value = { id };
        if (roomType) currentChatroom.value = { roomType };
      }}
    >
      <Group position="apart">
        <Group>
          {imageSrc && <AIAvatar src={imageSrc} />}
          <Text>{name}</Text>
        </Group>
        <ActionIcon
          onClick={() => {
            if (id) {
              mutateAsync({ chatroomId: id });
            }
          }}
        >
          <IconTrash />
        </ActionIcon>
      </Group>
    </UnstyledButton>
  );
};
