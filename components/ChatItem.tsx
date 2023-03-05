import {
  Text,
  Stack,
  Paper,
  TypographyStylesProvider,
  Group,
  ActionIcon,
  Progress,
} from "@mantine/core";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useEffect } from "react";
import { ChatInput } from "../utils/chatState";

export interface ChatItemProps extends ChatInput {}

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
    <Paper withBorder radius="md" p="md" pos="relative">
      <Stack>
        <Group position="apart">
          <Text>{role === "assistant" ? "Your AI" : "You"}</Text>
          {audio && (
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
          )}
        </Group>
        <TypographyStylesProvider>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </TypographyStylesProvider>
      </Stack>
    </Paper>
  );
};
