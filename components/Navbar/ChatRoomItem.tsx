import { ActionIcon, Group, Text, UnstyledButton } from "@mantine/core";
import { Chatroom, RoomType } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { trpc } from "../../lib/trpcClient";
import {
  currentChatroom,
  CurrentChatroomId,
  CurrentChatroomType,
} from "../../states/chatrooms";
import { AIAvatar } from "../AIAvatar";

export interface ChatRoomItemProps extends Pick<Chatroom, "name" | "roomType"> {
  id?: string;
  imageSrc?: string;
}

const predefinedRooms: RoomType[] = [
  RoomType.Explanation,
  RoomType.Summarize,
  RoomType.Tutor,
];
export const ChatRoomItem = ({
  imageSrc,
  name,
  id,
  roomType,
}: ChatRoomItemProps) => {
  const isActive =
    (currentChatroom.value as CurrentChatroomId)?.id &&
    (currentChatroom.value as CurrentChatroomId)?.id === id;
  const { refetch } = trpc.chatroom.getChatrooms.useQuery(undefined, {});
  const { mutateAsync } = trpc.chatroom.deleteChatroom.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  return (
    <UnstyledButton
      sx={{
        background: isActive ? "#f2f2f7" : "transparent",
        ":hover": {
          background: "#f2f2f7",
        },
        padding: 4,
      }}
      onClick={() => {
        if (id) return (currentChatroom.value = { id });
        if (roomType) return (currentChatroom.value = { roomType });
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
            if (isActive) {
              currentChatroom.value = undefined;
            }
          }}
        >
          <IconTrash />
        </ActionIcon>
      </Group>
    </UnstyledButton>
  );
};
