import { Box, Navbar as MantineNavbar, Stack } from "@mantine/core";
import { trpc } from "../../lib/trpcClient";
import { user } from "../../states/authentication";
import { defaultRooms } from "../../states/defaultRooms";
import { navbarState } from "../../states/navbarState";
import { ChatRoomItem } from "./ChatRoomItem";

export const Navbar = () => {
  const [
    { data: chatrooms, isLoading: isChatroomLoading },
    { data: defaultRooms, isLoading: isDefaultRoomLoading },
  ] = trpc.useQueries((t) => [
    t.chatroom.getChatrooms(undefined, {
      retry: false,
      enabled: !!user.value?.id,
      refetchOnWindowFocus: false,
    }),
    t.chatroom.getPredefinedRooms(undefined, {
      retry: false,
      enabled: !!user.value?.id,
      refetchOnWindowFocus: false,
    }),
  ]);
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
        <Stack>
          {chatrooms?.map((room, index) => (
            <ChatRoomItem {...room} key={index} />
          ))}
        </Stack>
        <Stack bottom={0}>
          {defaultRooms?.map((room, index) => (
            <ChatRoomItem {...room} key={index} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};
