import {
  Avatar,
  Box,
  Burger,
  Group,
  Header as MantineHeader,
} from "@mantine/core";
import { navbarState } from "../utils/navbarState";
import { AIAvatar } from "./AIAvatar";

export const Header = () => {
  return (
    <MantineHeader height={55} pos="sticky">
      <Group w="100%" h="100%" px={16}>
        <Burger
          opened={navbarState.value}
          onClick={() => (navbarState.value = !navbarState.value)}
        />
        <AIAvatar src="/ai.png" />
        <Box>{" { Fill Group Name } "}</Box>
      </Group>
    </MantineHeader>
  );
};
