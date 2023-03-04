import { Center, Flex } from "@mantine/core";
import { RecordButton } from "../components/RecordButton";
import { startRecording, stopRecording } from "../utils/audioState";

export default function Home() {
  return (
    <Flex w="100%" h="100%">
      <Center sx={{ flex: 1 }}>
        <RecordButton
          onClick={async (state) =>
            state ? startRecording() : stopRecording()
          }
        />
      </Center>
    </Flex>
  );
}
