import { Box, Burger, Group, Header as MantineHeader } from "@mantine/core";

import { Navbar } from "@/components/Navbar";
import { currentChatroom } from "@/states/chatrooms";
import { navbarState } from "@/states/navbarState";

import { AIAvatar } from "./AIAvatar";
import { CurrentChatInfo } from "./CurrentChatInfo";
import { Notifications } from "./Notifications";

export const Header = () => {
  return (
    <MantineHeader bg="#202123" height={55} pos="sticky" zIndex={10} p="sm">
      <Group w="100%" h="100%" position="apart">
        <Group>
          <Burger
            opened={navbarState.value}
            onClick={() => (navbarState.value = !navbarState.value)}
          />
          {currentChatroom.value && (
            <AIAvatar src={`/ai/${currentChatroom.value.image}`} />
          )}
          <Box>
            {currentChatroom.value?.name ?? "Pick a chatroom to continue"}
          </Box>
        </Group>
        <Group>
          <CurrentChatInfo />
          <Notifications />
        </Group>
      </Group>
    </MantineHeader>
  );
};
