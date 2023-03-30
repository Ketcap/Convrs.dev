import { Divider, Modal, Paper, Text } from "@mantine/core";
import { trpc } from "../../lib/trpcClient";
import { user } from "../../states/authentication";
import { AvatarSelect } from "../AvatarSelect";
import { ElevenLabs } from "./ElevenLabs";
import { OpenAI } from "./OpenAI";
import { isSettingsVisible } from "./state";

export const Settings = () => {
  const { isLoading, mutate } = trpc.user.updateAvatar.useMutation({
    onSuccess: (data) => {
      const oldUserInfo = user.peek();
      if (!oldUserInfo) return;
      user.value = {
        ...oldUserInfo,
        image: data.image,
      };
    },
  });
  return (
    <Modal
      title="Settings"
      opened={isSettingsVisible.value}
      onClose={() => (isSettingsVisible.value = false)}
      centered
    >
      <Text size="sm">
        You can adjust your settings like Open AI, ElevenLabs Keys, etc.
      </Text>

      <Divider label="API configuration" labelPosition="center" my="lg" />
      <OpenAI />
      <ElevenLabs />

      <Divider label="Account configuration" labelPosition="center" my="lg" />

      <AvatarSelect
        onChange={(avatar) => {
          mutate(avatar);
        }}
        loading={isLoading}
        disabled={isLoading}
        value={user?.value?.image}
      />
    </Modal>
  );
};
