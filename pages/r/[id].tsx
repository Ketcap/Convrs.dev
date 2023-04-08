import {
  ActionIcon,
  Alert,
  Box,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Textarea,
} from "@mantine/core";
import { RecordButton } from "@/components/RecordButton";
import { Chat } from "@/components/Chat";
import { IconExclamationMark, IconSend } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { createId } from "@paralleldrive/cuid2";
import { startRecording, stopRecording } from "@/states/audioState";
import { currentChatroom } from "@/states/chatrooms";

import { trpc } from "@/lib/trpcClient";
import { onErrorHandler } from "@/lib/trpcUtils";
import {
  addChatInput,
  addVoiceToChatInput,
  initializeChat,
  removeChatInput,
  editChatInput,
} from "@/states/chatState";
import { getVoiceOutput } from "@/states/elevenLabs";
import { notifications } from "@mantine/notifications";
import { SenderType } from "@prisma/client";
import { user } from "@/states/authentication";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { useSpotlight } from "@mantine/spotlight";

export default function Home() {
  const ref = useRef<HTMLTextAreaElement>();
  const router = useRouter();
  const spotlight = useSpotlight();
  const currentChatroomId = router.query.id as string;

  trpc.chatroom.getChatroom.useQuery(
    {
      chatroomId: currentChatroomId,
    },
    {
      onSuccess: (data) => {
        currentChatroom.value = data;
      },
      onError: (err) => {
        router.push("/");
      },
    }
  );

  const { mutateAsync: voiceToMessageMutation } =
    trpc.message.addVoiceToMessage.useMutation();
  const { isLoading: isChatroomLoading } =
    trpc.message.getChatroomMessages.useQuery(
      {
        chatroomId: currentChatroomId,
      },
      {
        onSuccess: async (data) => {
          await initializeChat(data);
        },
      }
    );
  const { isLoading: isThinking, mutateAsync: getAnswer } =
    trpc.openAI.getCompletion.useMutation({
      onError: onErrorHandler,
      onSuccess: async (data) => {
        addChatInput(data);
        if (currentChatroom.value?.voice) {
          getVoiceOutput({
            output: data.content,
            messageId: data.id,
            voiceKey: currentChatroom.value.voice,
            mutateAsync: voiceToMessageMutation,
          }).then((res) => {
            if (res) {
              addVoiceToChatInput(data.id, res);
            }
          });
        }
      },
    });

  const { mutateAsync: sendMessage } =
    trpc.message.sendMessageToChatroom.useMutation();

  const isApplicationAvailable = !(
    isChatroomLoading ||
    isThinking ||
    !currentChatroomId
  );

  useEffect(() => {
    const voiceStartId = "voice-start";
    const voiceStopId = "voice-stop";
    if (currentChatroomId) {
      spotlight.registerActions([
        {
          id: voiceStartId,
          title: "Start recording",
          description: "Start recording your voice for the current room",
          onTrigger: () => {
            startRecording(onVoiceSend);
          },
        },
        {
          id: voiceStopId,
          title: "Stop recording",
          description: "Stop recording your voice for the current room",
          onTrigger: () => {
            stopRecording();
          },
        },
      ]);
    }
    return () => {
      spotlight.removeActions([voiceStartId, voiceStopId]);
    };
  }, [currentChatroomId]);

  const onSend = () => {
    const val = ref.current!.value;
    if (!val || !currentChatroomId) return;
    const randomId = createId();
    // optimistic update
    addChatInput({
      id: randomId,
      content: val,
      chatroomId: currentChatroomId,
      createdAt: new Date(),
      isFavorite: false,
      senderType: SenderType.User,
      userId: `${user.peek()?.id}`,
      Voice: null,
    });
    sendMessage(
      {
        content: val,
        chatroomId: currentChatroomId,
      },
      {
        onSuccess: async (data) => {
          // correct the update with the correct id and other information
          editChatInput(randomId, data);
          getAnswer({
            chatroomId: data.chatroomId,
            content: data.content,
          });
        },
        onError: (err) => {
          onErrorHandler(err);
          removeChatInput(randomId);
        },
      }
    );
    ref.current!.value = "";
  };

  const onVoiceSend = (input: string) => {
    if (!currentChatroomId) return;
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
    const content = `${input}  ${val}`;
    const randomId = createId();
    // optimistic update
    addChatInput({
      id: randomId,
      content,
      chatroomId: currentChatroomId,
      createdAt: new Date(),
      isFavorite: false,
      senderType: SenderType.User,
      userId: `${user.peek()?.id}`,
      Voice: null,
    });
    sendMessage(
      {
        content,
        chatroomId: currentChatroomId,
      },
      {
        onSuccess: async (data) => {
          // correct the update with the correct id and other information
          editChatInput(randomId, data);
          getAnswer({
            chatroomId: data.chatroomId,
            content: data.content,
          });
        },
        onError: (err) => {
          onErrorHandler(err);
          removeChatInput(randomId);
        },
      }
    );
    ref.current!.value = "";
  };

  useEffect(() => {
    if (isApplicationAvailable) {
      ref.current?.focus();
    }
  }, [isApplicationAvailable]);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "flex-start",
          height: "100%",
          overflow: "auto",
          paddingBottom: 100,
        }}
      >
        <Chat />
      </Box>
      <Paper
        pos="absolute"
        sx={{ display: "flex", justifyContent: "center" }}
        bottom={0}
        left={0}
        right={0}
        p={20}
      >
        <Group align={"center"} w="100%">
          <LoadingOverlay
            visible={isThinking || isChatroomLoading}
            zIndex={5}
          />
          <Textarea
            ref={(inputRef) => (ref.current = inputRef!)}
            placeholder="If you have any input that you have copied from somewhere, paste it here then follow up with the recording button to talk about it."
            mah={75}
            rows={1}
            miw="55%"
            sx={{ display: "flex", flex: 1 }}
            wrapperProps={{ sx: { flex: 1 } }}
            disabled={!isApplicationAvailable}
            rightSection={<IconSend onClick={onSend} />}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <RecordButton
            disabled={!isApplicationAvailable}
            onClick={async (state) =>
              state ? startRecording(onVoiceSend) : stopRecording()
            }
          />
        </Group>
      </Paper>
    </Layout>
  );
}
