
import { notifications } from "@mantine/notifications";
import { signal } from "@preact/signals-react";

import { onRecordingStop } from "./handle";

export const isMicrophoneAllowed = signal<boolean | null>(null);

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

let mediaRecorder: MediaRecorder | null = null;
let stream: MediaStream | null = null;

export const startRecording = async (fn: (text: string) => void) => {
  stream = await getAudioStream();
  if (!stream) return;
  mediaRecorder = new MediaRecorder(stream, {
    audioBitsPerSecond: 128000,
  });
  let chunks: Blob[] = [];
  mediaRecorder.ondataavailable = async ({ data }) => {
    chunks = [...chunks, data];
  };
  mediaRecorder.onstop = () => {
    stream?.getTracks().forEach((track) => track.stop());
    mediaRecorder = null;
    stream = null;
    onRecordingStop(chunks, fn);
  };
  mediaRecorder.start();
}

export const stopRecording = () => {
  mediaRecorder?.stop();
}