import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Settings } from "../Settings";
import { isSettingsVisible } from "../Settings/state";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.black,
    "&:hover": {
      backgroundColor: theme.colors.gray[0],
    },
  },
}));

interface ProfileButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
}

export function ProfileButton({
  image,
  name,
  email,
  ...others
}: ProfileButtonProps) {
  const { classes } = useStyles();

  return (
    <>
      <UnstyledButton
        className={classes.user}
        {...others}
        onClick={() => (isSettingsVisible.value = true)}
      >
        <Group>
          <Avatar src={image} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>

            <Text color="dimmed" size="xs">
              {email}
            </Text>
          </div>

          <IconChevronRight size="0.9rem" stroke={1.5} />
        </Group>
      </UnstyledButton>
      <Settings />
    </>
  );
}
