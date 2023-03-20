import { Grid } from "@mantine/core";
import { chatState } from "../states/chatState";
import { ChatItem } from "./ChatItem";

export const Chat = () => (
  <Grid m={0} w="100%">
    {chatState.value.map((chat, index) => (
      <Grid.Col span={12} mb="md" key={index} p={0}>
        <ChatItem {...chat} key={index} />
      </Grid.Col>
    ))}
  </Grid>
);
