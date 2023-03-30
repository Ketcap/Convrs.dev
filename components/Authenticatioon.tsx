import {
  Button,
  Group,
  Modal,
  Stack,
  Loader,
  Text,
  TextInput,
  Checkbox,
  PasswordInput,
  Divider,
  Paper,
  Anchor,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import { user } from "../states/authentication";
import { upperFirst, useToggle } from "@mantine/hooks";
import { z } from "zod";
import { IconX } from "@tabler/icons-react";
import { trpc } from "../lib/trpcClient";
import { onErrorHandler } from "../lib/trpcUtils";
import { setAuthentication } from "../lib/authentication";

export const Authentication = () => {
  const [type, toggle] = useToggle(["login", "register"] as const);
  const { isLoading, refetch } = trpc.user.me.useQuery(undefined, {
    onSuccess: (data) => {
      user.value = data;
    },
  });
  const { mutate: login, isLoading: signInLoading } =
    trpc.authentication.signIn.useMutation({
      onError: onErrorHandler,
      onSuccess: (data) => {
        setAuthentication(data, refetch);
      },
    });
  const { mutate: register, isLoading: signUpLoading } =
    trpc.authentication.signUp.useMutation({
      onError: onErrorHandler,
      onSuccess: (data) => {
        setAuthentication(data, refetch);
      },
    });

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },
    validate: {
      email: (val) => {
        try {
          z.string().email().parse(val);
        } catch (err) {
          return (err as Error).message;
        }
      },
      password: (val) => {
        try {
          z.string().min(8).parse(val);
        } catch (err) {
          return (err as Error).message;
        }
      },
    },
  });

  const onSubmit = form.onSubmit((val, event) => {
    event.preventDefault();
    const { email, password, name, terms } = val;
    if (type === "register" && !terms) {
      showNotification({
        message: "Please accept terms and conditions",
        icon: <IconX color="red" />,
      });
      return;
    }
    if (type === "login") {
      return login({ email, password });
    }
    if (type === "register") {
      return register({ email, password, name });
    }
  });

  return (
    <Modal
      opened={!user.value?.id}
      onClose={() => {}}
      withCloseButton={false}
      centered
    >
      {isLoading ? (
        <Group position="center" mih={300}>
          <Loader />
        </Group>
      ) : (
        <Paper radius="md" p="xl">
          <Text size="lg" weight={500}>
            Welcome to Talk to AI
          </Text>

          <Divider
            label={`${upperFirst(type)} with email`}
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={onSubmit}>
            <Stack>
              {type === "register" && (
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue("name", event.currentTarget.value)
                  }
                  radius="md"
                />
              )}

              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />

              {type === "register" && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              )}
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
              <Button
                type="submit"
                radius="xl"
                loading={signInLoading || signUpLoading}
              >
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Paper>
      )}
    </Modal>
  );
};
