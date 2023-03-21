import { notifications } from "@mantine/notifications";
import { refreshToken, token } from "./authentication";

type EndpointError = {
  error: string;
  message: string
}
type EndpointOutput = {
  message: string;
} | EndpointError


export const onRecordingStop = async (blobs: Blob[], fn: (text: string) => void) => {
  const formData = new FormData();
  const blob = new Blob(blobs, { type: "audio/mpeg;" });
  formData.append("file", blob);

  try {
    const transcript: EndpointOutput = await fetch('/api/openAI/whisper', {
      method: 'POST',
      body: formData,
      headers: {
        authorization: token.peek() ?? '',
        refreshToken: refreshToken.peek() ?? '',
      }
    }).then(res => res.json());
    if (!transcript?.message) {
      throw new Error('No message')
    }
    fn(transcript.message);
  } catch (e) {
    return notifications.show({
      title: "Ups!",
      message:
        "I couldn't understand you, please try again",
      color: "red",
    });
  }
}