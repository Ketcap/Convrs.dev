import { Alert, Grid } from "@mantine/core";
import { IconThumbUp } from "@tabler/icons-react";
import { chatState } from "../states/chatState";
import { ChatItem } from "./ChatItem";

export const Chat = () => {
  const isEmpty = chatState.value.length === 0;
  return (
    <Grid m={0} w="100%">
      {isEmpty && (
        <Grid.Col span={12} mb="md" p={0}>
          <Alert
            icon={<IconThumbUp size="1rem" />}
            title="Congratz!"
            color="teal"
            radius="xs"
            variant="outline"
          >
            Your room is ready send message to kick off the chat.
          </Alert>
        </Grid.Col>
      )}
      {chatState.value.map((chat, index) => (
        <Grid.Col span={12} mb="md" key={index} p={0}>
          <ChatItem {...chat} key={index} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
