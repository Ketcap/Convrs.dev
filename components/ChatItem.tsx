import {
  Paper,
  TypographyStylesProvider,
  Group,
  ActionIcon,
  Progress,
  Grid,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useSignal } from "@preact/signals-react";
import { SenderType } from "@prisma/client";
import {
  IconCopy,
  IconPlayerPlay,
  IconPlayerStop,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { trpc } from "../lib/trpcClient";
import { onErrorHandler } from "../lib/trpcUtils";
import { user } from "../states/authentication";
import { currentChatroom } from "../states/chatrooms";
import { ChatInput, chatState } from "../states/chatState";
import { AIAvatar } from "./AIAvatar";
import { ChatGenerateVoice } from "./ChatGenerateVoice";

export interface ChatItemProps extends ChatInput {}

export const ChatItem = (chatInput: ChatItemProps) => {
  const { mutate, isLoading } = trpc.message.starMessage.useMutation({
    onMutate: ({ isFavorite }) => {
      const currentChatState = chatState.peek();
      chatState.value = currentChatState.map((chat) => {
        if (chat.id === chatInput.id) {
          chat.isFavorite = isFavorite;
        }
        return chat;
      });
      return { isFavorite };
    },
    onError: ({ data, message, shape }, { isFavorite }) => {
      onErrorHandler({ data, message, shape });
      const currentChatState = chatState.peek();
      chatState.value = currentChatState.map((chat) => {
        if (chat.id === chatInput.id) {
          chat.isFavorite = isFavorite;
        }
        return chat;
      });
    },
    onSuccess: ({ isFavorite, id }) => {
      const currentChatState = chatState.peek();
      chatState.value = currentChatState.map((chat) => {
        if (chat.id === id) {
          chat.isFavorite = isFavorite;
        }
        return chat;
      });
    },
  });
  const clipboard = useClipboard();
  const { senderType, content, audio, markdown, isFavorite } = chatInput;
  const isRoomVoiceAvailable = currentChatroom.value?.voice;
  const currentProgress = useSignal(0);
  const isPlaying = useSignal(false);

  useEffect(() => {
    if (audio) {
      audio.onplaying = () => {
        isPlaying.value = true;
      };
      audio.ontimeupdate = () => {
        const currentTime = parseInt(`${audio.currentTime * 10}`);
        const duration = parseInt(`${audio.duration * 10}`);
        currentProgress.value = (currentTime / duration) * 100;
      };
      audio.onended = () => {
        isPlaying.value = false;
        currentProgress.value = 0;
      };
    }
  });

  return (
    <Paper pos="relative">
      <Grid align={"flex-end"} m={0}>
        <Grid.Col span={1}>
          <Grid.Col
            span={"content"}
            p={0}
            pl={8}
            sx={{ justifyContent: "flex-end", display: "inline-flex" }}
          >
            <AIAvatar
              src={`/ai/${
                senderType === SenderType.User
                  ? user.value?.image
                  : currentChatroom.value?.image
              }`}
            />
          </Grid.Col>
        </Grid.Col>
        <Grid.Col
          span={11}
          bg="#f2f2f7"
          sx={{ borderRadius: 4 }}
          pos="relative"
        >
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: markdown ?? content }} />
          </TypographyStylesProvider>

          {/* Bottom Action Items */}
          <Group position="right" spacing="xs">
            <ActionIcon onClick={() => clipboard.copy(content)}>
              <IconCopy />
            </ActionIcon>
            {!isRoomVoiceAvailable && !audio && (
              <ChatGenerateVoice chatInput={chatInput} />
            )}
            {audio && (
              <Group position="apart">
                <>
                  <Progress
                    value={currentProgress.value}
                    pos="absolute"
                    sx={{ left: 0, right: 0, bottom: 0, animation: "all 20ms" }}
                  />
                  <ActionIcon
                    onClick={() => {
                      const isPlayAction = isPlaying.value;

                      if (!isPlayAction) {
                        audio.currentTime = 0;

                        audio.play().catch(console.log);
                      }
                      if (isPlayAction) {
                        audio.pause();
                      }
                      isPlaying.value = !isPlaying.value;
                    }}
                  >
                    {isPlaying.value ? <IconPlayerStop /> : <IconPlayerPlay />}
                  </ActionIcon>
                </>
              </Group>
            )}
            <ActionIcon
              color="orange"
              disabled={isLoading}
              onClick={() =>
                mutate({ isFavorite: !isFavorite, messageId: chatInput.id })
              }
            >
              {isFavorite ? <IconStarFilled /> : <IconStar color="orange" />}
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
