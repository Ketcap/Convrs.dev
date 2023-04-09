import {
  Box,
  createStyles,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconLogout, IconMoon, IconPlus, IconSun } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { trpc } from "@/lib/trpcClient";
import { user } from "@/states/authentication";
import { navbarState, newChatroomModal } from "@/states/navbarState";
import { NewChatroomModal } from "../NewChatroomModal/NewChatroomModal";
import { Button } from "./Button";
import { ChatRoomItem } from "./ChatRoomItem";
import { ProfileButton } from "./ProfileButton";
import { removeAuthentication } from "../../lib/authentication";

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
  const utils = trpc.useContext();

  const { data = [], isLoading: isChatroomLoading } =
    trpc.chatroom.getChatrooms.useQuery(undefined, {
      enabled: !!user.value?.id,
    });

  const chatrooms = user.value ? data : [];

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
      p={8}
    >
      <Stack justify={"space-between"} w="100%" mah="calc(100vh - 55px - 16px)">
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 5,
            overflow: "auto",
          }}
        >
          <Button
            label="Start a new chat"
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
            label="Toggle navbar"
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
          <Button
            label="Logout"
            right={<IconLogout color="#ECECF1" />}
            onClick={() => {
              removeAuthentication();
              utils.invalidate();
              router.push("/");
            }}
          >
            <Text color="#ECECF1">Logout</Text>
          </Button>
        </Stack>
      </Stack>
      {user.value && (
        <NewChatroomModal
          opened={newChatroomModal.value}
          onClose={() => (newChatroomModal.value = false)}
        />
      )}
    </Box>
  );
};
