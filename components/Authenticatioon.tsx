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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import nookies from "nookies";
import { showNotification } from "@mantine/notifications";

import { user } from "../states/authentication";
import { upperFirst, useToggle } from "@mantine/hooks";
import { z } from "zod";
import { IconX } from "@tabler/icons-react";
import { trpc } from "../lib/trpcClient";
import { onErrorHandler } from "../lib/trpcUtils";

export const Authentication = () => {
  const [type, toggle] = useToggle(["login", "register"] as const);
  const { data, isLoading, refetch } = trpc.user.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 0,
    cacheTime: 0,
    onSuccess: (data) => {
      user.value = data;
    },
  });
  const { mutate: login } = trpc.authentication.signIn.useMutation({
    onError: onErrorHandler,
    onSuccess: (data) => {
      if (!data.session?.access_token) return;
      nookies.set(null, "token", data.session?.access_token, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
      refetch();
    },
  });
  const { mutate: register } = trpc.authentication.signUp.useMutation({
    onError: onErrorHandler,
    onSuccess: (data) => {
      if (!data.session?.access_token) return;
      nookies.set(null, "token", data.session?.access_token, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
      refetch();
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
      <Paper radius="md" p="xl" withBorder>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Text size="lg" weight={500}>
              Welcome to Talk to AI
            </Text>

            {/* <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group> */}

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
                <Button type="submit" radius="xl">
                  {upperFirst(type)}
                </Button>
              </Group>
            </form>
          </>
        )}
      </Paper>
    </Modal>
  );
};
