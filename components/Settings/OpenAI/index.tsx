import {
  Accordion,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Application } from "@prisma/client";
import Link from "next/link";
import { z } from "zod";
import { trpc } from "../../../lib/trpcClient";
import { onErrorHandler } from "../../../lib/trpcUtils";
import { user } from "../../../states/authentication";

export const OpenAI = () => {
  const { refetch } = trpc.openAI.getModels.useQuery(undefined, {
    enabled: false,
    onError: () => {
      notifications.show({
        title: "OpenAI cannot be loaded",
        message: "Check your API key to make sure you have entered correctly.",
        color: "red",
      });
    },
  });

  const { isLoading, mutate } = trpc.user.config.useMutation({
    onError: onErrorHandler,
    onSuccess: () => {
      refetch();
    },
  });
  const openAIConfig = user?.value?.Configs.find(
    (e) => e.application === Application.OpenAI
  );
  const form = useForm({
    initialValues: {
      key: openAIConfig?.key ?? "",
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
    mutate({
      application: Application.OpenAI,
      key: val.key,
    });
  });

  return (
    <Stack>
      <Accordion radius="md" variant="filled">
        <Accordion.Item value="customization">
          <Accordion.Control>
            <Text>Open AI Configuration</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              {"If you don't know where to find your API key, please visit"}
            </Text>
            <Text size="sm">
              <Link href="https://platform.openai.com/account/api-keys">
                OpenAI Dashboard
              </Link>
            </Text>
            <form onSubmit={onSubmit}>
              <Group align="flex-end" position="apart">
                <PasswordInput
                  w="100%"
                  required
                  label="Open AI API Key"
                  placeholder="sk-************************************************"
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
