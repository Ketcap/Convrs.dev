import { Box, Stack, UnstyledButton } from "@mantine/core";
import { useSignal } from "@preact/signals-react";
import { trpc } from "../../lib/trpcClient";
import { user } from "../../states/authentication";
import { currentChatroom } from "../../states/chatrooms";
import { navbarState } from "../../states/navbarState";
import { NewChatroomModal } from "../NewChatroomModal/NewChatroomModal";
import { ChatRoomItem } from "./ChatRoomItem";
import { ProfileButton } from "./ProfileButton";

export const Navbar = () => {
  const isModalOpen = useSignal(false);
  const { data: chatrooms = [], isLoading: isChatroomLoading } =
    trpc.chatroom.getChatrooms.useQuery(undefined, {
      enabled: !!user.value?.id,
    });
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
              isModalOpen.value = true;
            }}
          >
            Start a new chat
          </UnstyledButton>
          {chatrooms.map((room) => (
            <ChatRoomItem chatroom={room} key={room.id} />
          ))}
        </Stack>
        {user.value && (
          <ProfileButton
            image={`/ai/${user.value.image}`}
            email={user.value.email}
            name={user.value.name}
          />
        )}
      </Stack>
      <NewChatroomModal
        opened={isModalOpen.value}
        onClose={() => (isModalOpen.value = false)}
      />
    </Box>
  );
};
