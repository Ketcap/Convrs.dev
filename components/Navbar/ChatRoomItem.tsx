import { Group, Text, UnstyledButton } from "@mantine/core";
import { AIAvatar } from "../AIAvatar";

export interface ChatRoomItemProps {
  imageSrc: string;
  title: string;
}

export const ChatRoomItem = ({ imageSrc, title }: ChatRoomItemProps) => {
  return (
    <UnstyledButton sx={{ ":hover": { background: "#f2f2f7" }, padding: 4 }}>
      <Group>
        <AIAvatar src={imageSrc} />
        <Text>{title}</Text>
      </Group>
    </UnstyledButton>
  );
};
