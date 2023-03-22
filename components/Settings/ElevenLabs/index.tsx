import {
  Accordion,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Application, ConfigType } from "@prisma/client";
import { z } from "zod";
import { trpc } from "../../../lib/trpcClient";
import { onErrorHandler } from "../../../lib/trpcUtils";
import { user } from "../../../states/authentication";
import { elevenLabsKey } from "../../../states/elevenLabs";

export const ElevenLabs = () => {
  const { isLoading, mutateAsync } = trpc.user.config.useMutation({
    onError: onErrorHandler,
  });

  const form = useForm({
    initialValues: {
      key: elevenLabsKey.value ?? "",
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
          configType: ConfigType.Key,
        },
        {
          onSuccess: (data) => {
            elevenLabsKey.value = data.key;
            if (user.value) {
              const filtered = (user.value?.Configs ?? []).filter(
                (e) =>
                  e.application !== Application.ElevenLabs &&
                  e.key !== ConfigType.Key
              );
              user.value = {
                ...user.value,
                Configs: [...filtered, data],
              };
            }
          },
        }
      );
    }
  });
  // e6ba3435fa47849c4f042023b11ab99d
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
