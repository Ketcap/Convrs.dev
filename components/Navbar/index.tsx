import {
  Box,
  createStyles,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconMoon, IconPlus, IconSun } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../lib/trpcClient";
import { user } from "../../states/authentication";
import { navbarState, newChatroomModal } from "../../states/navbarState";
import { NewChatroomModal } from "../NewChatroomModal/NewChatroomModal";
import { Button } from "./Button";
import { ChatRoomItem } from "./ChatRoomItem";
import { ProfileButton } from "./ProfileButton";

const useStyles = createStyles((theme) => ({
  navbar: {
    background: "#202123",
    position: "sticky",
  },
}));

export const Navbar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const spotlight = useSpotlight();
  const router = useRouter();
  const { classes } = useStyles();
  const { data: chatrooms = [], isLoading: isChatroomLoading } =
    trpc.chatroom.getChatrooms.useQuery(undefined, {
      enabled: !!user.value?.id,
    });

  useEffect(() => {
    if (!isChatroomLoading && chatrooms.length > 0) {
      spotlight.registerActions(
        chatrooms.map((chatroom) => ({
          id: chatroom.id,
          title: chatroom.name,
          description: `${chatroom.model} - ${chatroom.directive}`,
          onTrigger: () => {
            router.push("/r/[id]", `/r/${chatroom.id}`);
          },
        }))
      );
    }
  }, [isChatroomLoading, chatrooms]);

  return (
    <Box
      w={{ base: 250 }}
      display={navbarState.value ? "flex" : "none"}
      className={classes.navbar}
    >
      <Stack justify={"space-between"} w="100%" p="sm">
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 5,
            overflow: "auto",
          }}
        >
          <Button
            onClick={() => {
              newChatroomModal.value = true;
            }}
            right={<IconPlus color="#ECECF1" />}
          >
            <Text color="#ECECF1">Start a new chat</Text>
          </Button>
          {chatrooms.map((room) => (
            <ChatRoomItem chatroom={room} key={room.id} />
          ))}
        </Stack>
        <Stack>
          <Button
            onClick={() => toggleColorScheme()}
            right={
              colorScheme === "dark" ? (
                <IconSun color={"#ECECF1"} />
              ) : (
                <IconMoon color={"#ECECF1"} />
              )
            }
          >
            <Text color="#ECECF1">
              {colorScheme === "dark" ? "Light" : "Dark"} Mode
            </Text>
          </Button>
          {user.value && (
            <ProfileButton
              image={`/ai/${user.value.image}`}
              email={user.value.email}
              name={user.value.name}
            />
          )}
        </Stack>
      </Stack>
      <NewChatroomModal
        opened={newChatroomModal.value}
        onClose={() => (newChatroomModal.value = false)}
      />
    </Box>
  );
};
