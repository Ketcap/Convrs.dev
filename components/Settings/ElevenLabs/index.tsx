import {
  Accordion,
  Button,
  Group,
  Input,
  PasswordInput,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Application, ConfigType } from "@prisma/client";
import { z } from "zod";
import { trpc } from "../../../lib/trpcClient";
import { onErrorHandler } from "../../../lib/trpcUtils";
import { user } from "../../../states/authentication";
import { Voice, elevenLabsKey, voiceList } from "../../../states/elevenLabs";

export const ElevenLabs = () => {
  const { isLoading, mutateAsync } = trpc.user.config.useMutation({
    onError: onErrorHandler,
  });
  const elevenLabConfig = user?.value?.Configs.find(
    (e) => e.application === Application.ElevenLabs
  );

  const form = useForm({
    initialValues: {
      key: `${elevenLabConfig?.key}`,
      voice: `${elevenLabsKey.value}`,
    },
    validate: {
      key: (val) => {
        try {
          z.string().parse(val);
        } catch (err) {
          return (err as Error).message;
        }
      },
    },
  });

  const onSubmit = form.onSubmit((val) => {
    if (val.key) {
      mutateAsync(
        {
          application: Application.ElevenLabs,
          key: val.key,
        },
        {
          onSuccess: (data) => {
            elevenLabsKey.value = data.key;
          },
        }
      );
    }
    if (val.voice) {
      mutateAsync({
        application: Application.ElevenLabs,
        key: val.voice,
        configType: ConfigType.Voice,
      });
    }
  });

  console.log(voiceList.value);
  return (
    <Stack>
      <Accordion radius="md" variant="filled">
        <Accordion.Item value="customization">
          <Accordion.Control>
            <Text>ElevenLabs Configuration</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={onSubmit}>
              <Group align="flex-end" position="apart">
                <PasswordInput
                  w="100%"
                  required
                  label="ElevenLabs Key"
                  placeholder="********************************"
                  value={form.values.key}
                  onChange={(event) =>
                    form.setFieldValue("key", event.currentTarget.value)
                  }
                  error={
                    form.errors.key &&
                    "Please make sure you entered key correctly"
                  }
                  radius="md"
                  disabled={isLoading}
                />
                <Select
                  label="Voice you would like to use"
                  placeholder="Pick one"
                  data={voiceList.value?.map((e) => ({
                    value: e.voice_id,
                    label: e.name,
                  }))}
                />
                <Button
                  variant={"default"}
                  ml="auto"
                  type="submit"
                  loading={isLoading}
                >
                  Save
                </Button>
              </Group>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};
