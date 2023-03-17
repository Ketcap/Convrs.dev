import { effect, signal } from "@preact/signals-react";
import { Application, ConfigType } from "@prisma/client";
import { trpc } from "../lib/trpcClient";
import { user } from "./authentication";

const elevenLabsUrl = 'https://api.elevenlabs.io/v1'

export interface Voice {
  "voice_id": string;
  name: string
}

export const voiceList = signal<Voice[]>([]);
export const elevenLabsKey = signal<string | undefined>(undefined);
export const voiceKey = signal<string | undefined>(undefined);

effect(async () => {
  const { Configs = [] } = user.value || {};
  const voiceConfig = Configs.find(
    (e) =>
      e.application === Application.ElevenLabs && e.type === ConfigType.Key
  );
  const selectedVoice = Configs.find(
    (e) =>
      e.application === Application.ElevenLabs && e.type === ConfigType.Voice
  );
  if (!voiceConfig) return voiceList.value = [];
  if (selectedVoice) {
    voiceKey.value = selectedVoice.key
  }
  elevenLabsKey.value = voiceConfig.key;
  const responseVoiceList = await fetch(`${elevenLabsUrl}/voices`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'xi-api-key': voiceConfig.key as string,
    },
  }).then(res => res.json()) as { voices: Voice[] }
  voiceList.value = responseVoiceList.voices
})


export const getVoiceOutput = async (output: string, messageId: string, mutateAsync: ReturnType<typeof trpc.message.addVoiceToMessage.useMutation>['mutateAsync']) => {
  const val = voiceKey.peek();
  const elevenLabsKeyVal = elevenLabsKey.peek();
  if (!val || !elevenLabsKeyVal) return;
  const responseVoice = await fetch(`${elevenLabsUrl}/text-to-speech/${val}`, {
    method: 'POST',
    headers: {
      'accept': 'audio/mpeg',
      'xi-api-key': elevenLabsKeyVal,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "text": output,
      "voice_settings": {
        "stability": 0.60,
        "similarity_boost": 0.65
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