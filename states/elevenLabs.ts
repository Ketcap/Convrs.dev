import { notifications } from "@mantine/notifications";
import { effect, signal } from "@preact/signals-react";
import { Application, ConfigType } from "@prisma/client";
import { trpc } from "../lib/trpcClient";
import { user } from "./authentication";
import { currentChatroom } from "./chatrooms";

const elevenLabsUrl = 'https://api.elevenlabs.io/v1'

export interface Voice {
  "voice_id": string;
  name: string
}

export const voiceList = signal<Voice[]>([]);
export const elevenLabsKey = signal<string | undefined>(undefined);

export const findVoice = (voiceId: string) => {
  const voices = voiceList.peek();
  if (!voices) return;
  return voices.find(e => e.voice_id === voiceId)?.name
}

effect(async () => {
  const { Configs = [] } = user.value || {};
  const voiceConfig = Configs.find(
    (e) =>
      e.application === Application.ElevenLabs && e.type === ConfigType.Key
  );
  if (!voiceConfig) return voiceList.value = [];
  elevenLabsKey.value = voiceConfig.key;
  try {
    const responseVoiceList = await fetch(`${elevenLabsUrl}/voices`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xi-api-key': voiceConfig.key as string,
      },
    })
    const response = await responseVoiceList.json() as unknown as { voices: Voice[] } | { detail: { message: string } };
    if ('detail' in response) {
      throw new Error(response.detail.message);
    }
    voiceList.value = response.voices
  } catch {

    notifications.show({
      title: "Voices cannot be loaded",
      message:
        "Check your API key to make sure you have entered correctly.",
      color: "red",
    });
  }
})


export const getVoiceOutput = async ({
  output, messageId, voiceKey, mutateAsync
}: {
  output: string; messageId: string; voiceKey: string; mutateAsync: ReturnType<typeof trpc.message.addVoiceToMessage.useMutation>['mutateAsync'];
}) => {
  const elevenLabsKeyVal = elevenLabsKey.peek();
  if (!elevenLabsKeyVal) return;
  const {
    voiceClarity = 0.65,
    voiceStability = 0.60
  } = currentChatroom.peek() || {}

  const responseVoice = await fetch(`${elevenLabsUrl}/text-to-speech/${voiceKey}`, {
    method: 'POST',
    headers: {
      'accept': 'audio/mpeg',
      'xi-api-key': elevenLabsKeyVal,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "text": output,
      "voice_settings": {
        "stability": Number(voiceStability),
        "similarity_boost": Number(voiceClarity)
      }
    })
  }).then(res => res.arrayBuffer())
  try {
    mutateAsync({
      messageId,
      voice: Buffer.from(responseVoice)
    })
  }
  catch { }
  return responseVoice
}

