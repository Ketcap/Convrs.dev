import { Grid } from "@mantine/core";
import { SenderType } from "@prisma/client";
import { chatState } from "../states/chatState";
import { ChatItem } from "./ChatItem";

export const Chat = () => (
  <Grid m={0} w="100%">
    {chatState.value.map((chat, index) => (
      <Grid.Col
        span={10}
        mb="md"
        key={index}
        p={0}
        offset={chat.role === SenderType.User ? 2 : 0}
      >
        <ChatItem {...chat} key={index} />
      </Grid.Col>
    ))}
  </Grid>
);
