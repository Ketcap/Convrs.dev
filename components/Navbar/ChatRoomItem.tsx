import { Group, Text, UnstyledButton } from "@mantine/core";
import { Chatroom } from "@prisma/client";
import { currentChatroom } from "../../states/chatrooms";
import { AIAvatar } from "../AIAvatar";

export interface ChatRoomItemProps extends Pick<Chatroom, "name" | "id"> {
  imageSrc?: string;
}

export const ChatRoomItem = ({ imageSrc, name, id }: ChatRoomItemProps) => {
  return (
    <UnstyledButton
      sx={{ ":hover": { background: "#f2f2f7" }, padding: 4 }}
      onClick={() => {
        currentChatroom.value = id;
      }}
    >
      <Group>
        {imageSrc && <AIAvatar src={imageSrc} />}
        <Text>{name}</Text>
      </Group>
    </UnstyledButton>
  );
};
