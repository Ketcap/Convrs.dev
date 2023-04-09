import { notifications } from "@mantine/notifications";
import { Application } from "@prisma/client";
import { user } from "./authentication";

type EndpointOutput = {
  text: string;
}

export const onRecordingStop = async (blob: Blob[], fn: (text: string) => void) => {
  const formData = new FormData();
  const file = new File(blob, 'speech.mp3', {
    type: 'audio/mpeg',
  })
  formData.append("file", file);
  formData.append('model', 'whisper-1')
  formData.append('language', 'en')

  try {
    const openAIConfig = user.peek()?.Configs.find(c => c.application === Application.OpenAI);
    if (!openAIConfig) return;
    const { key } = openAIConfig;
    const transcript: EndpointOutput = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${key}`,
      }
    }).then(res => res.json());
    if (!(transcript as EndpointOutput).text) {
      throw new Error('No message')
    }
    fn(transcript.text);
  } catch (e) {
    return notifications.show({
      title: "Ups!",
      message:
        "I couldn't understand you, please try again",
      color: "red",
    });
  }
}