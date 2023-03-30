import {
  ActionIcon,
  Drawer,
  Text,
  Paper,
  ScrollArea,
  Stack,
  TypographyStylesProvider,
  Title,
  Divider,
} from "@mantine/core";
import { useSignal } from "@preact/signals-react";
import { SenderType } from "@prisma/client";
import { IconInfoCircle } from "@tabler/icons-react";
import { currentChatroom } from "../states/chatrooms";
import { chatState } from "../states/chatState";
import { findVoice } from "../states/elevenLabs";

export const CurrentChatInfo = () => {
  const isInfoOpen = useSignal(false);

  if (!currentChatroom.value?.id) return null;

  const favoritesList = chatState.value.filter((chat) => chat.isFavorite);
  return (
    <>
      <ActionIcon onClick={() => (isInfoOpen.value = true)}>
        <IconInfoCircle />
      </ActionIcon>
      <Drawer
        opened={isInfoOpen.value}
        onClose={() => (isInfoOpen.value = false)}
        title="Chatroom Info"
        position="right"
      >
        {currentChatroom.value && (
          <Stack>
            <Text>
              Room Name: <b>{currentChatroom.value.name}</b>
            </Text>
            <Text>
              Model: <b>{currentChatroom.value.model}</b>
            </Text>
            <Text>
              Max Tokens: <b>{currentChatroom.value.maxToken}</b>
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
            <ScrollArea>
              <Title order={4}>Favorite Messages</Title>
              <Divider my="md" />

              {favoritesList.map(({ id, markdown, content, senderType }) => (
                <>
                  <Paper p={0} key={id}>
                    <Text>
                      {senderType === SenderType.System ? "AI" : "You"}
                    </Text>
                    <TypographyStylesProvider>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: markdown ?? content,
                        }}
                      />
                    </TypographyStylesProvider>
                  </Paper>
                  <Divider my="sm" variant="dotted" />
                </>
              ))}
            </ScrollArea>
          </Stack>
        )}
      </Drawer>
    </>
  );
};
