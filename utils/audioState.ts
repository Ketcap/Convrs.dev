
import { notifications } from "@mantine/notifications";
import { signal } from "@preact/signals-react";

import { getVoiceOutput } from "./elevenLabs";

export const isMicrophoneAllowed = signal<boolean | null>(null);

export const stream = signal<MediaStream | null>(null);

export const getAudioStream = async () => {
  try {
    const stream = await navigator.mediaDevices
      .getUserMedia({ video: false, audio: true });
    return stream
  } catch {
    notifications.show({
      title: "Permission Error",
      message:
        "Please allow access to your microphone on website settings",
      color: "red",
    });
    return null
  }
}

export const currentStream = signal<MediaStream | null>(null);
export const currentMedia = signal<MediaRecorder | null>(null);

export const startRecording = async () => {
  const stream = await getAudioStream();
  if (!stream) return;
  currentStream.value = stream;
  const mediaRecorder = new MediaRecorder(currentStream.value);
  currentMedia.value = mediaRecorder;
  let chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    chunks = [...chunks, e.data];
  };
  mediaRecorder.onstop = () => {
    onStop(chunks);

    currentStream.value = null;
    currentMedia.value = null;

  };
  mediaRecorder.start();
}

const onStop = async (blobs: Blob[]) => {
  const formData = new FormData();
  const blob = new Blob(blobs, { type: "audio/mpeg;" });
  formData.append("file", blob);

  const transcript: { text: string } = await fetch('/api/whisper', {
    method: 'POST',
    body: formData
  }).then(res => res.json());

  const response: { message: string } = await fetch('/api/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: transcript.text
    })
  }).then(res => res.json());

  const voice = await getVoiceOutput(response.message);
  // @ts-ignore
  const audioUrl = URL.createObjectURL(new Blob([new Uint8Array(voice)]));
  const audio = new Audio(audioUrl);
  audio.play();

}

export const stopRecording = async () => {
  currentMedia.value?.stop();
}