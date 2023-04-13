import { useCallback, useEffect, useRef } from "react";
import { Box, Group, LoadingOverlay, Paper, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/router";
import { useSpotlight } from "@mantine/spotlight";
import { notifications } from "@mantine/notifications";
import { SenderType } from "@prisma/client";

import { Chat } from "@/components/Chat";
import { RecordButton } from "@/components/RecordButton";
import { Layout } from "@/components/Layout";

import { currentChatroom } from "@/states/chatrooms";
import { startRecording, stopRecording } from "@/states/audioState";
import {
  addChatInput,
  addVoiceToChatInput,
  initializeChat,
  removeChatInput,
  editChatInput,
} from "@/states/chatState";
import { getVoiceOutput } from "@/states/elevenLabs";
import { user } from "@/states/authentication";

import { trpc } from "@/lib/trpcClient";
import { getOpenAIAnswer } from "@/lib/chat";
import { onErrorHandler } from "@/lib/trpcUtils";
import { useSignal } from "@preact/signals-react";

export default function Home() {
  const ref = useRef<HTMLTextAreaElement>();
  const router = useRouter();
  const spotlight = useSpotlight();
  const isThinking = useSignal(false);
  const currentChatroomId = router.query.id as string;

  const { mutateAsync: sendMessage } =
    trpc.message.sendMessageToChatroom.useMutation();

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

  const getAnswer = useCallback(
    async ({ chatroomId }: { chatroomId: string }) => {
      isThinking.value = true;
      try {
        const { message, id } = (await getOpenAIAnswer(chatroomId)) ?? {};
        if (!message || !id) return;

        const chatroomMessage = await sendMessage({
          chatroomId,
          content: message,
          role: SenderType.Assistant,
        });
        // update id from the optimistic update
        editChatInput(id, {
          id: chatroomMessage.id,
        });
        const { voice } = currentChatroom.peek() ?? {};
        if (voice && message) {
          getVoiceOutput({
            messageId: chatroomMessage.id,
            mutateAsync: voiceToMessageMutation,
            output: message,
            voiceKey: voice,
          }).then((voiceOutput) => {
            if (voiceOutput) {
              addVoiceToChatInput(chatroomMessage.id, voiceOutput);
            }
          });
        }
      } finally {
        isThinking.value = false;
      }
    },
    [sendMessage, voiceToMessageMutation]
  );

  const isApplicationAvailable = !(
    isChatroomLoading ||
    isThinking.value ||
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

  const onSend = async () => {
    const val = ref.current!.value;
    if (!val || !currentChatroomId) return;
    const randomId = createId();
    // optimistic update
    await addChatInput({
      id: randomId,
      content: val,
      chatroomId: currentChatroomId,
      createdAt: new Date(),
      isFavorite: false,
      senderType: SenderType.User,
      userId: `${user.peek()?.id}`,
      Voice: null,
    });
    getAnswer({
      chatroomId: currentChatroomId,
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
        },
        onError: (err) => {
          onErrorHandler(err);
          removeChatInput(randomId);
        },
      }
    );
    ref.current!.value = "";
  };

  const onVoiceSend = async (input: string) => {
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
    await addChatInput({
      id: randomId,
      content,
      chatroomId: currentChatroomId,
      createdAt: new Date(),
      isFavorite: false,
      senderType: SenderType.User,
      userId: `${user.peek()?.id}`,
      Voice: null,
    });
    getAnswer({
      chatroomId: currentChatroomId,
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
            visible={isThinking.value || isChatroomLoading}
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
