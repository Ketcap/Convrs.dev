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
import { notifications } from "@mantine/notifications";

export default function Home() {
  const ref = useRef<HTMLTextAreaElement>();
  // @ts-ignore
  const { id: chatroomId = undefined, roomType = undefined } =
    currentChatroom.value ?? {};
  const { mutateAsync: voiceToMessageMutation } =
    trpc.message.addVoiceToMessage.useMutation();
  const { isLoading: isChatroomLoading } =
    trpc.message.getChatroomMessages.useQuery(
      {
        chatroomId,
        roomType,
      },
      {
        enabled: !!chatroomId || !!roomType,

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
        getVoiceOutput(data.content, data.id, voiceToMessageMutation).then(
          (res) => {
            if (res) {
              addVoiceToChatInput(data.id, res);
            }
          }
        );
        addChatInput({
          content: data.content,
          role: data.senderType,
          id: data.id,
          timestamp: data.createdAt,
        });
      },
    });
  const { refetch } = trpc.chatroom.getChatrooms.useQuery(undefined, {
    enabled: false,
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
        if (data.chatroomId !== currentChatroom.peek()?.id) {
          currentChatroom.value = { id: data.chatroomId };
          refetch();
        }
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
      chatroomId: chatroomId,
      roomType: roomType,
    });
    ref.current!.value = "";
  };

  const onVoiceSend = (input: string) => {
    if (!input) {
      notifications.show({
        title: "Nothing has said",
        message:
          "Please try to speak when you press the button and make sure you are speaking to the microphone",
        color: "red",
      });
      return;
    }
    const val = ref.current!.value;
    sendMessage({
      content: `${input}  ${val}`,
      chatroomId: chatroomId,
      roomType: roomType,
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
          visible={
            isThinking || (isChatroomLoading && !!chatroomId && !!roomType)
          }
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
              state ? startRecording(onVoiceSend) : stopRecording()
            }
          />
        </Group>
      </Box>
    </>
  );
}
