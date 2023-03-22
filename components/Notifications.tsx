import {
  ActionIcon,
  Alert,
  Indicator,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useSignal } from "@preact/signals-react";
import { IconBell, IconExclamationMark } from "@tabler/icons-react";
import Link from "next/link";

export const Notifications = () => {
  const isNotificationOpen = useSignal(false);

  return (
    <>
      <ActionIcon onClick={() => (isNotificationOpen.value = true)}>
        <Indicator>
          <IconBell />
        </Indicator>
      </ActionIcon>
      <Modal
        opened={isNotificationOpen.value}
        onClose={() => (isNotificationOpen.value = false)}
        title="Information"
      >
        <Stack>
          <Alert
            color="red"
            icon={<IconExclamationMark size="1rem" />}
            title="Personal Information"
            radius="xs"
            variant="outline"
          >
            Do not put any personal information into the application.
          </Alert>
          <Text>
            We do not save your voice data. After voice is proccessed, it is
            deleted. Proccessing of the voice is done via{" "}
            <Link href="https://openai.com/research/whisper">
              Whisper from Open AI
            </Link>
          </Text>
          <Text>
            Responses of your messages are done via{" "}
            <Link href="https://openai.com/blog/chatgpt">ChatGPT.</Link>
            Messages are save in the database and used to keep conversation
            going.
          </Text>
          <Text>
            Voice generation is done by the{" "}
            <Link href="https://www.eleven-labs.com/en/">Eleven Labs</Link> API.
          </Text>
          <Text>
            This application is still in development. Some features may not work
            properly you can report them to{" "}
            <Link href="https://github.com/Ketcap/Talk-to-AI/issues">
              GitHub Issues
            </Link>{" "}
            and put as much information as possible so we can fix it.
          </Text>
          <Text>
            If you have any further questions, you reach out to me on{" "}
            <Link href="https://twitter.com/uur_oruc">Twitter</Link>
          </Text>
          <Text>
            All the usages are done behalf of the user. The user is responsible
            for the usage of the application.
          </Text>
        </Stack>
      </Modal>
    </>
  );
};
