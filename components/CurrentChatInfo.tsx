import { ActionIcon, Modal, Stack, Text } from "@mantine/core";
import { useSignal } from "@preact/signals-react";
import { IconInfoCircle } from "@tabler/icons-react";
import { currentChatroom } from "../states/chatrooms";
import { findVoice } from "../states/elevenLabs";

export const CurrentChatInfo = () => {
  const isInfoOpen = useSignal(false);

  if (!currentChatroom.value?.id) return null;

  return (
    <>
      <ActionIcon onClick={() => (isInfoOpen.value = true)}>
        <IconInfoCircle />
      </ActionIcon>
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
    </>
  );
};
