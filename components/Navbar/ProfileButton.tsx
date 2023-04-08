import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
  Box,
} from "@mantine/core";
import { Settings } from "../Settings";
import { isSettingsVisible } from "../Settings/state";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    color: "#ECECF1",
    borderRadius: 8,
    padding: theme.spacing.xs,
    backgroundColor: "#343540",
  },
}));

interface ProfileButtonProps {
  image: string;
  name: string;
  email: string;
}

export function ProfileButton({ image, name, email }: ProfileButtonProps) {
  const { classes } = useStyles();

  return (
    <>
      <UnstyledButton
        className={classes.user}
        onClick={() => (isSettingsVisible.value = true)}
      >
        <Group>
          <Avatar src={image} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>
            <Box w={150}>
              <Text color="dimmed" size="xs" truncate={true}>
                {email}
              </Text>
            </Box>
          </div>
        </Group>
      </UnstyledButton>
      <Settings />
    </>
  );
}
