import { Divider, Modal, Paper, Text } from "@mantine/core";
import { isSet } from "util/types";
import { ElevenLabs } from "./ElevenLabs";
import { OpenAI } from "./OpenAI";
import { isSettingsVisible } from "./state";

export const Settings = () => {
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
    </Modal>
  );
};
