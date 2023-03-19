import { notifications } from "@mantine/notifications";

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
    const transcript: EndpointOutput = await fetch('/api/whisper', {
      method: 'POST',
      body: formData
    }).then(res => res.json());
    if ('error' in transcript) {
      throw new Error(transcript.message)
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