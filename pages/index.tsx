import { Affix, Flex, Paper, Stack } from "@mantine/core";
import { ChatItem } from "../components/ChatItem";
import { RecordButton } from "../components/RecordButton";
import { startRecording, stopRecording } from "../utils/audioState";
import { chatState } from "../utils/chatState";

export default function Home() {
  return (
    <>
      <Stack align="strech" justify="flex-start">
        {chatState.value.map((chat, index) => (
          <ChatItem {...chat} key={index} />
        ))}
      </Stack>
      <Affix position={{ right: 20, bottom: 20 }}>
        <RecordButton
          onClick={async (state) =>
            state ? startRecording() : stopRecording()
          }
        />
      </Affix>
    </>
  );
}
