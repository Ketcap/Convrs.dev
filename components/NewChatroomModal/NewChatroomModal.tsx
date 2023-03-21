import {
  Text,
  Modal,
  ModalProps,
  Divider,
  TextInput,
  Select,
  Group,
  Button,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { trpc } from "../../lib/trpcClient";
import { onErrorHandler } from "../../lib/trpcUtils";
import { currentChatroom } from "../../states/chatrooms";
import { voiceList } from "../../states/elevenLabs";

export interface NewChatroomModalProps extends ModalProps {}

export const NewChatroomModal = ({
  opened,
  onClose,
}: NewChatroomModalProps) => {
  const util = trpc.useContext();
  const { mutate: createRoom, isLoading } = trpc.chatroom.create.useMutation({
    onError: onErrorHandler,
    onSuccess: (data) => {
      currentChatroom.value = data;
      util.chatroom.getChatrooms.setData(undefined, (old = []) => [
        ...old,
        data,
      ]);
      onClose();
    },
  });
  const form = useForm({
    initialValues: {
      name: "",
      openAIModel: "",
      directive: "",
      voice: "",
    },
    validate: {
      name: (val) => {
        try {
          z.string().parse(val);
        } catch (err) {
          return (err as Error).message;
        }
      },
      openAIModel: (val) => {
        try {
          z.string().parse(val);
        } catch (err) {
          return (err as Error).message;
        }
      },
    },
  });
  const onSubmit = form.onSubmit((data) => {
    createRoom(data);
  });

  const { data } = trpc.openAI.getModels.useQuery(undefined, {
    cacheTime: 1000 * 60 * 60 * 24,
    onSuccess: (data) => {
      form.setFieldValue("openAIModel", data[0]);
    },
  });

  return (
    <Modal onClose={onClose} opened={opened} title="New Chatroom" centered>
      <form onSubmit={onSubmit}>
        <Text size="sm">
          You can start a new chat by setting room name, OPEN AI model, voice.
        </Text>
        <Divider label="Room Settings" labelPosition="center" my="lg" />
        <TextInput
          required
          label="Room Name"
          placeholder="My new chatroom"
          value={form.values.name}
          onChange={(event) =>
            form.setFieldValue("name", event.currentTarget.value)
          }
          error={form.errors.email && "Set Room Name"}
          radius="md"
        />
        <Divider label="OpenAI Settings" labelPosition="center" my="lg" />
        <Select
          value={form.values.openAIModel}
          label="ChatGPT Model"
          placeholder="Pick one"
          onChange={(item) => {
            form.setFieldValue("openAIModel", item!);
          }}
          data={(data ?? []).map((e) => ({
            value: e,
            label: e,
          }))}
          mb="sm"
          error={form.errors.email && "Select model to for Open AI"}
        />
        <Textarea
          required
          label="Directive"
          description="You can pre-fill the chat with a directive."
          placeholder="You are an usefull explanation bot for explaining things to people."
          value={form.values.directive}
          onChange={(event) =>
            form.setFieldValue("directive", event.currentTarget.value)
          }
          radius="md"
          error={form.errors.email && "Set directive for the room"}
        />
        <Divider label="Voice Settings" labelPosition="center" my="lg" />
        <Select
          value={form.values.voice}
          clearable
          label="Voice you would like to use"
          placeholder="Pick one"
          onChange={(item) => {
            form.setFieldValue("voice", item!);
          }}
          data={(voiceList.value ?? []).map((e) => ({
            value: e.voice_id,
            label: e.name,
          }))}
        />
        <Group mt="lg" position="right">
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Create Chat
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
