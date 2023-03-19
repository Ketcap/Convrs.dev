import { Box, Stack, UnstyledButton } from "@mantine/core";
import { trpc } from "../../lib/trpcClient";
import { user } from "../../states/authentication";
import { currentChatroom } from "../../states/chatrooms";
import { navbarState } from "../../states/navbarState";
import { ChatRoomItem } from "./ChatRoomItem";
import { ProfileButton } from "./ProfileButton";

export const Navbar = () => {
  const [
    { data: chatrooms, isLoading: isChatroomLoading },
    { data: defaultRooms, isLoading: isDefaultRoomLoading },
  ] = trpc.useQueries((t) => [
    t.chatroom.getChatrooms(undefined, {
      retry: false,
      enabled: !!user.value?.id,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.length > 0) {
          currentChatroom.value = { id: data[data.length - 1].id };
        }
      },
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
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 5,
            overflow: "auto",
          }}
        >
          <UnstyledButton
            sx={{ ":hover": { background: "#f2f2f7" }, padding: 4 }}
            onClick={() => {
              currentChatroom.value = undefined;
            }}
          >
            Start a new chat
          </UnstyledButton>
          {chatrooms?.map(
            ({ createdAt: _, directives: __, ...room }, index) => (
              <ChatRoomItem {...room} key={index} />
            )
          )}
        </Stack>
        <Stack
          bottom={0}
          sx={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          {defaultRooms?.map((room, index) => (
            <ChatRoomItem {...room} key={index} />
          ))}
          {user.value && (
            <ProfileButton
              image="/ai-2.png"
              email={user.value.email}
              name={user.value.name}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
