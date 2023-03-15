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
import { ChatInput } from "../utils/chatState";
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

export const ChatItem = ({ role, content, audio }: ChatItemProps) => {
  const currentProgress = useSignal(0);
  const isPlaying = useSignal(false);

  useEffect(() => {
    if (audio) {
      audio.ontimeupdate = () => {
        const currentTime = parseInt(`${audio.currentTime * 10}`);
        const duration = parseInt(`${audio.duration * 10}`);
        currentProgress.value = (currentTime / duration) * 100;
      };
    }
  }, [audio]);

  return (
    <Paper pos="relative">
      <Grid align={"flex-end"} m={0}>
        {role === "assistant" && <ChatItemUser position="left" />}
        <Grid.Col span={10} bg="#f2f2f7">
          {audio && (
            <Group position="apart">
              <>
                <Progress
                  value={currentProgress.value}
                  pos="absolute"
                  sx={{ left: 0, right: 0, top: 0, animation: "all 100ms" }}
                />
                <ActionIcon
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
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </Text>
          </TypographyStylesProvider>
        </Grid.Col>
        {role === "user" && <ChatItemUser position="right" />}
      </Grid>
    </Paper>
  );
};
