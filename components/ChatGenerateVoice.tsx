import { ActionIcon, Loader, Menu } from "@mantine/core";
import { useSignal } from "@preact/signals-react";
import { IconLoader, IconSpeakerphone } from "@tabler/icons-react";
import { trpc } from "../lib/trpcClient";
import { addVoiceToChatInput, ChatInput } from "../states/chatState";
import { Voice, voiceList, getVoiceOutput } from "../states/elevenLabs";

export interface ChatGenerateVoiceProps {
  chatInput: ChatInput;
}

export const ChatGenerateVoice = ({ chatInput }: ChatGenerateVoiceProps) => {
  const loadingVoice = useSignal(false);
  const { mutateAsync: voiceToMessageMutation } =
    trpc.message.addVoiceToMessage.useMutation();

  if (voiceList.value.length < 1) return null;

  const onClick = (key: Voice["voice_id"]) => () => {
    loadingVoice.value = true;
    getVoiceOutput({
      output: chatInput.content,
      messageId: chatInput.id,
      voiceKey: key,
      mutateAsync: voiceToMessageMutation,
    })
      .then((res) => {
        if (res) {
          addVoiceToChatInput(chatInput.id, res);
        }
      })
      .finally(() => {
        loadingVoice.value = false;
      });
  };

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon disabled={loadingVoice.value}>
          {loadingVoice.value ? (
            <Loader variant="bars" />
          ) : (
            <IconSpeakerphone />
          )}
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {voiceList.value.map((voice) => (
          <Menu.Item key={voice.voice_id} onClick={onClick(voice.voice_id)}>
            {voice.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
