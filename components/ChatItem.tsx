import {
  Text,
  Stack,
  Paper,
  TypographyStylesProvider,
  Group,
  ActionIcon,
  Progress,
  Grid,
  Box,
} from "@mantine/core";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useEffect } from "react";
import { ChatInput } from "../states/chatState";
import { AIAvatar } from "./AIAvatar";

export interface ChatItemProps extends ChatInput {}

const ChatItemUser = ({ position }: { position: "left" | "right" }) => (
  <Grid.Col
    span={"content"}
    p={0}
    pl={position !== "left" ? 8 : 0}
    pr={position !== "right" ? 8 : 0}
    sx={{ justifyContent: "flex-end", display: "inline-flex" }}
  >
    <AIAvatar src="/ai-3.png" />
  </Grid.Col>
);

export const ChatItem = ({ role, content, audio, markdown }: ChatItemProps) => {
  const currentProgress = useSignal(0);
  const isPlaying = useSignal(false);

  useEffect(() => {
    if (audio) {
      audio.ontimeupdate = () => {
        isPlaying.value = true;
        const currentTime = parseInt(`${audio.currentTime * 10}`);
        const duration = parseInt(`${audio.duration * 10}`);
        currentProgress.value = (currentTime / duration) * 100;
      };
      audio.onended = () => {
        isPlaying.value = false;
        currentProgress.value = 0;
      };
    }
  }, [audio]);

  return (
    <Paper pos="relative">
      <Grid align={"flex-end"} m={0}>
        <Grid.Col span={1}>
          <ChatItemUser position="left" />
        </Grid.Col>
        <Grid.Col
          span={11}
          bg="#f2f2f7"
          sx={{ borderRadius: 4 }}
          pos="relative"
        >
          {audio && (
            <Group position="apart">
              <>
                <Progress
                  value={currentProgress.value}
                  pos="absolute"
                  sx={{ left: 0, right: 0, top: 0, animation: "all 100ms" }}
                />
                <ActionIcon
                  pos={"absolute"}
                  right={16}
                  top={16}
                  onClick={() => {
                    const isPlayAction = isPlaying.value;

                    if (!isPlayAction) {
                      audio.currentTime = 0;
                      audio.play();
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

          <TypographyStylesProvider>
            <Text>
              <div
                dangerouslySetInnerHTML={{ __html: markdown ?? content }}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </Text>
          </TypographyStylesProvider>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
