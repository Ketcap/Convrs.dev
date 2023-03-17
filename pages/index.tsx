import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { RecordButton } from "../components/RecordButton";
import { startRecording, stopRecording } from "../states/audioState";
import { Chat } from "../components/Chat";
import { IconSend } from "@tabler/icons-react";
import { useRef } from "react";
import { currentChatroom } from "../states/chatrooms";
import { trpc } from "../lib/trpcClient";
import { onErrorHandler } from "../lib/trpcUtils";
import {
  addChatInput,
  addVoiceToChatInput,
  chatState,
  initializeChat,
} from "../states/chatState";
import { getVoiceOutput } from "../states/elevenLabs";
import { addMessageAsStream } from "../lib/chat";

export default function Home() {
  const ref = useRef<HTMLTextAreaElement>();
  const currentChatRoomId = currentChatroom.value;
  const { mutateAsync: voiceToMessageMutation } =
    trpc.message.addVoiceToMessage.useMutation();
  const { isLoading: isChatroomLoading } =
    trpc.message.getChatroomMessages.useQuery(
      {
        chatroomId: currentChatRoomId!,
      },
      {
        enabled: !!currentChatRoomId,
        refetchOnWindowFocus: false,
        retry: false,
        onSuccess: async (data) => {
          initializeChat(data);
        },
      }
    );
  const { isLoading: isThinking, mutateAsync: getAnswer } =
    trpc.openAI.getCompletion.useMutation({
      cacheTime: 0,
      onError: onErrorHandler,
      onSuccess: async (data) => {
        addMessageAsStream(data);
      },
    });
  const { mutateAsync: sendMessage } =
    trpc.message.sendMessageToChatroom.useMutation({
      cacheTime: 0,
      onError: onErrorHandler,
      onSuccess: async (data) => {
        getAnswer({
          chatroomId: data.chatroomId,
          content: data.content,
        });
        addChatInput({
          content: data.content,
          role: data.senderType,
          id: data.id,
          timestamp: data.createdAt,
        });
      },
    });
  const onSend = () => {
    const val = ref.current!.value;
    if (!val) return;
    sendMessage({
      content: val,
      chatroomId: currentChatRoomId,
    });
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
        <LoadingOverlay
          visible={isThinking || (isChatroomLoading && !!currentChatRoomId)}
        />
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
