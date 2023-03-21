import {
  ActionIcon,
  Alert,
  Box,
  Group,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { RecordButton } from "../components/RecordButton";
import { startRecording, stopRecording } from "../states/audioState";
import { Chat } from "../components/Chat";
import { IconExclamationMark, IconSend } from "@tabler/icons-react";
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
  const { id: currentChatRoomId, voice } = currentChatroom.value ?? {};
  const { mutateAsync: voiceToMessageMutation } =
    trpc.message.addVoiceToMessage.useMutation();
  const { isLoading: isChatroomLoading } =
    trpc.message.getChatroomMessages.useQuery(
      {
        chatroomId: currentChatRoomId!,
      },
      {
        enabled: !!currentChatRoomId,
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
        if (voice) {
          getVoiceOutput({
            output: data.content,
            messageId: data.id,
            voiceKey: voice,
            mutateAsync: voiceToMessageMutation,
          }).then((res) => {
            if (res) {
              addVoiceToChatInput(data.id, res);
            }
          });
        }
        addChatInput({
          content: data.content,
          role: data.senderType,
          id: data.id,
          timestamp: data.createdAt,
        });
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
    if (!val || !currentChatRoomId) return;
    sendMessage({
      content: val,
      chatroomId: currentChatRoomId,
    });
    ref.current!.value = "";
  };

  const onVoiceSend = (input: string) => {
    if (!currentChatRoomId) return;
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
        {currentChatRoomId ? (
          <Chat />
        ) : (
          <Box sx={{ flex: 1 }}>
            <Alert
              icon={<IconExclamationMark size="1rem" />}
              title="Before you continue!"
              radius="xs"
              variant="outline"
            >
              Please make sure you have your OpenAI settings set up correctly.
              And create / select a room before you continue
            </Alert>
          </Box>
        )}
      </Box>
      <Box pos="sticky" bg="white" bottom={0} py={10}>
        {currentChatRoomId && (
          <LoadingOverlay visible={isThinking || isChatroomLoading} />
        )}
        <Group align={"center"}>
          <Textarea
            ref={(inputRef) => (ref.current = inputRef!)}
            placeholder="If you have any input that you have copied from somewhere, paste it here then follow up with the recording button to talk about it."
            sx={{ display: "flex", flex: 1 }}
            wrapperProps={{ sx: { flex: 1 } }}
            disabled={isChatroomLoading || isThinking || !currentChatRoomId}
          />
          <ActionIcon disabled={!currentChatRoomId}>
            <IconSend onClick={onSend} />
          </ActionIcon>
          <RecordButton
            disabled={isChatroomLoading || isThinking || !currentChatRoomId}
            onClick={async (state) =>
              state ? startRecording(onVoiceSend) : stopRecording()
            }
          />
        </Group>
      </Box>
    </>
  );
}
