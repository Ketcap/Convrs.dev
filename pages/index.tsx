import { ActionIcon, Box, Button, Group, Textarea } from "@mantine/core";
import { RecordButton } from "../components/RecordButton";
import { startRecording, stopRecording } from "../utils/audioState";
import { Chat } from "../components/Chat";
import { IconSend } from "@tabler/icons-react";
import { useRef } from "react";
import { getAnswer } from "../utils/handle";

export default function Home() {
  const ref = useRef<HTMLTextAreaElement>();
  const onSend = () => {
    const val = ref.current!.value;
    if (!val) return;
    getAnswer(val);
    ref.current!.value = "";
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          background: "#fff",
          alignItems: "flex-start",
        }}
        p="md"
      >
        <Chat />
      </Box>
      <Box pos="sticky" bg="white" bottom={0} py={10}>
        <Group align={"center"}>
          <Textarea
            ref={(inputRef) => (ref.current = inputRef!)}
            placeholder="If you have any input that you have copied from somewhere, paste it here then follow up with the recording button to talk about it."
            sx={{ display: "flex", flex: 1 }}
            wrapperProps={{ sx: { flex: 1 } }}
          />
          <ActionIcon>
            <IconSend onClick={onSend} />
          </ActionIcon>
          <RecordButton
            onClick={async (state) =>
              state ? startRecording() : stopRecording()
            }
          />
        </Group>
      </Box>
    </>
  );
}
