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
  Slider,
  Space,
  Stack,
  Switch,
  Box,
  LoadingOverlay,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useSignal } from "@preact/signals-react";
import { RoomFeature } from "@prisma/client";
import { useRouter } from "next/router";
import { z } from "zod";
import { trpc } from "../../lib/trpcClient";
import { onErrorHandler } from "../../lib/trpcUtils";
import { user } from "../../states/authentication";
import { currentChatroom } from "../../states/chatrooms";
import { voiceList } from "../../states/elevenLabs";
import { AvatarSelect } from "../AvatarSelect";

export interface NewChatroomModalProps extends ModalProps {}

export const NewChatroomModal = ({
  opened,
  onClose,
}: NewChatroomModalProps) => {
  const router = useRouter();
  const isVocieActive = useSignal<boolean>(false);
  const selectedAvatar = useSignal<string>("ai-1.png");
  const util = trpc.useContext();
  const stability = useSignal(0.6);
  const clarity = useSignal(0.65);
  const { mutate: createRoom, isLoading } = trpc.chatroom.create.useMutation({
    onError: onErrorHandler,
    onSuccess: (data) => {
      currentChatroom.value = data;
      router.push("/r/[id]", `/r/${data.id}`);
      util.chatroom.getChatrooms.setData(undefined, (old = []) => [
        ...old,
        data,
      ]);
      onClose();
      form.reset();
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      openAIModel: "",
      directive: "You are a helpful assistant",
      roomFeatures: undefined as RoomFeature | undefined,
      voice: "",
      maxToken: 250,
    },
    validate: {
      name: (val) => {
        try {
          z.string().parse(val);
        } catch (err) {
          return "Set Room Name";
        }
      },
      openAIModel: (val) => {
        try {
          z.string().min(0).parse(val);
        } catch (err) {
          return "Select model to for Open AI";
        }
      },
      maxToken: (val) => {
        try {
          z.number().min(1).parse(val);
        } catch (err) {
          return "Max tokens must be greater than 0";
        }
      },
    },
  });

  const { data: modelData, isLoading: isModelLoading } =
    trpc.openAI.getModels.useQuery(undefined, {
      enabled: !!user.value,
      onSuccess: (data) => {
        form.setFieldValue("openAIModel", data[0]);
      },
      onError: () => {
        notifications.show({
          title: "OpenAI cannot be loaded",
          message:
            "Check your API key to make sure you have entered correctly.",
          color: "red",
        });
      },
    });

  const onSubmit = form.onSubmit((data) => {
    if (modelData?.length) form.setFieldValue("openAIModel", modelData[0]);
    const voiceProps = isVocieActive.value
      ? { voiceClarity: clarity.value, voiceStability: stability.value }
      : {};
    console.log(data);
    // return;
    createRoom({
      ...data,
      ...voiceProps,
      openAIModel: data.openAIModel || modelData?.[0],
      image: selectedAvatar.value,
      features: data.roomFeatures ? [data.roomFeatures] : [],
    });
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
          error={form.errors.name && "Set Room Name"}
          radius="md"
        />
        <Space mt="xl" />
        <Select
          clearable
          data={[
            {
              value: RoomFeature.OnlyLastMessage,
              label: "Only Use Last Message",
            },
          ]}
          value={form.values.roomFeatures}
          onChange={(item) => {
            form.setFieldValue("roomFeatures", item as RoomFeature);
          }}
          label="Room Features"
          placeholder="Select Feature"
        />
        <Space mt="xl" />
        <AvatarSelect
          onChange={(avatar) => (selectedAvatar.value = avatar)}
          loading={isLoading}
          disabled={isLoading}
          value={selectedAvatar.value}
          size="md"
        />
        <Box pos={"relative"}>
          <Divider label="OpenAI Settings" labelPosition="center" my="lg" />
          <Select
            value={form.values.openAIModel}
            label="ChatGPT Model"
            placeholder="Pick one"
            onChange={(item) => {
              form.setFieldValue("openAIModel", item!);
            }}
            data={(modelData ?? []).map((e) => ({
              value: e,
              label: e,
            }))}
            mb="sm"
            error={form.errors.openAIModel && "Select model to for Open AI"}
          />
          <NumberInput
            value={form.values.maxToken}
            placeholder="250"
            label="Max Tokens to be used"
            onChange={(item) => {
              form.setFieldValue("maxToken", item === "" ? 0 : item);
            }}
            withAsterisk
            mb="sm"
            error={form.errors.maxToken}
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
            error={form.errors.directive && "Set directive for the room"}
          />
          <LoadingOverlay visible={isModelLoading} />
        </Box>
        <Divider label="Voice Settings" labelPosition="center" my="lg" />
        <Switch
          labelPosition="left"
          label="Enable Voice for AI"
          checked={isVocieActive.value}
          onChange={(event) =>
            (isVocieActive.value = event.currentTarget.checked)
          }
          wrapperProps={{
            sx: {
              ".mantine-Switch-body": {
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
              },
            },
          }}
        />
        <Space mt={16} />
        {isVocieActive.value && (
          <>
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
            <Stack p="lg">
              <Text size="sm" weight={500}>
                Stability
              </Text>
              <Slider
                value={stability.value}
                onChange={(value) => {
                  stability.value = value;
                }}
                min={0}
                step={0.01}
                max={1}
                scale={(val) => Number(val.toFixed(2))}
                marks={[
                  {
                    value: 0,
                    label: "0%",
                  },
                  { value: 0.5, label: "50%" },
                  {
                    value: 1,
                    label: "100%",
                  },
                ]}
              />
              <Space h="md" />
              <Text size="sm" weight={500}>
                Clarity + Similarity Enhancement
              </Text>
              <Slider
                value={clarity.value}
                min={0}
                step={0.01}
                max={1}
                scale={(val) => Number(val.toFixed(2))}
                onChange={(value) => {
                  clarity.value = value;
                }}
                marks={[
                  {
                    value: 0,
                    label: "0%",
                  },
                  { value: 0.5, label: "50%" },
                  {
                    value: 1,
                    label: "100%",
                  },
                ]}
              />
            </Stack>
          </>
        )}

        <Group mt="lg" position="right">
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Create Chat
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
