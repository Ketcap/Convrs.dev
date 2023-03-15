import { Box, Navbar as MantineNavbar, Stack } from "@mantine/core";
import { defaultRooms } from "../../utils/defaultRooms";
import { navbarState } from "../../utils/navbarState";
import { ChatRoomItem } from "./ChatRoomItem";

export const Navbar = () => {
  return (
    <Box
      p="xs"
      w={{ base: 250 }}
      display={navbarState.value ? "flex" : "none"}
      h={{ base: "calc(100vh - 55px)" }}
      sx={{
        background: "#fff",
        position: "sticky",
        top: 55,
        borderRight: "1px solid #eee",
      }}
    >
      <Stack justify={"space-between"} w="100%">
        <Stack></Stack>
        <Stack bottom={0}>
          {defaultRooms.map((room, index) => (
            <ChatRoomItem {...room} key={index} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};
