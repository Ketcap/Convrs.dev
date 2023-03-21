import {
  ActionIcon,
  Text,
  Box,
  Burger,
  Group,
  Header as MantineHeader,
  Modal,
  Stack,
} from "@mantine/core";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { IconInfoCircle } from "@tabler/icons-react";
import { currentChatroom } from "../states/chatrooms";
import { findVoice } from "../states/elevenLabs";
import { navbarState } from "../states/navbarState";
import { AIAvatar } from "./AIAvatar";

export const Header = () => {
  const isInfoOpen = useSignal(false);
  useSignalEffect(() => {
    if (currentChatroom.value?.id) {
      isInfoOpen.value = false;
    }
  });
  return (
    <MantineHeader height={55} pos="sticky" zIndex={10} p="sm">
      <Group w="100%" h="100%" position="apart">
        <Group>
          <Burger
            opened={navbarState.value}
            onClick={() => (navbarState.value = !navbarState.value)}
          />
          <AIAvatar src="/ai.png" />
          <Box>
            {currentChatroom.value?.name ?? "Pick a chatroom to continue"}
          </Box>
        </Group>
        {currentChatroom.value?.id && (
          <ActionIcon onClick={() => (isInfoOpen.value = true)}>
            <IconInfoCircle />
          </ActionIcon>
        )}
        <Modal
          opened={isInfoOpen.value}
          onClose={() => (isInfoOpen.value = false)}
          title="Chatroom Info"
        >
          {currentChatroom.value && (
            <Stack>
              <Text>
                Room Name: <b>{currentChatroom.value.name}</b>
              </Text>
              <Text>
                Model: <b>{currentChatroom.value.model}</b>
              </Text>
              {currentChatroom.value.voice && (
                <Text>
                  Voice: <b>{findVoice(currentChatroom.value.voice) ?? ""}</b>
                </Text>
              )}
              {currentChatroom.value.directive && (
                <Text>
                  Directive: <b>{currentChatroom.value.directive}</b>
                </Text>
              )}
              <Text>
                Created at:{" "}
                <b>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(currentChatroom.value.createdAt)}
                </b>
              </Text>
            </Stack>
          )}
        </Modal>
      </Group>
    </MantineHeader>
  );
};
