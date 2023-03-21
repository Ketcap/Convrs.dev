import {
  Accordion,
  Button,
  Group,
  Input,
  PasswordInput,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Application } from "@prisma/client";
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
  const { data, isLoading, mutateAsync } = trpc.user.config.useMutation({
    onError: onErrorHandler,
    onSuccess: async () => {
      refetch();
    },
  });
  const openAIConfig = user?.value?.Configs.find(
    (e) => e.application === Application.OpenAI
  );
  const form = useForm({
    initialValues: {
      key: openAIConfig?.key ?? "",
      // model: "", // to be added
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
    mutateAsync({
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
