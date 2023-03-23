import {
  Text,
  Paper,
  TypographyStylesProvider,
  Group,
  ActionIcon,
  Progress,
  Grid,
  Box,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useSignal } from "@preact/signals-react";
import { SenderType } from "@prisma/client";
import { IconCopy, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useEffect } from "react";
import { currentChatroom } from "../states/chatrooms";
import { ChatInput } from "../states/chatState";
import { AIAvatar } from "./AIAvatar";
import { ChatGenerateVoice } from "./ChatGenerateVoice";

export interface ChatItemProps extends ChatInput {}

const ChatItemUser = ({ role }: { role: SenderType }) => (
  <Grid.Col
    span={"content"}
    p={0}
    pl={8}
    sx={{ justifyContent: "flex-end", display: "inline-flex" }}
  >
    <AIAvatar src={role === SenderType.User ? "/ai-7.png" : "/ai.png"} />
  </Grid.Col>
);

export const ChatItem = (chatInput: ChatItemProps) => {
  const clipboard = useClipboard();
  const { role, content, audio, markdown } = chatInput;
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
          <ChatItemUser role={role} />
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
          <Group position="right">
            <ActionIcon onClick={() => clipboard.copy(content)}>
              <IconCopy />
            </ActionIcon>
            {!isRoomVoiceAvailable && !audio && role === "Assistant" && (
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
                    pos={"absolute"}
                    right={16}
                    bottom={16}
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
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
