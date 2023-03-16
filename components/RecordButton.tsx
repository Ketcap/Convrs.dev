import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { isMicrophoneAllowed } from "../states/audioState";

interface RecordButtonProps {
  onClick: (state: boolean) => Promise<void>;
}

const size = 50;
const recordingSize = 35;

export const RecordButton = ({ onClick }: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const currentSize = isRecording ? recordingSize : size;

  const isMicAvailable =
    isMicrophoneAllowed.value === null || isMicrophoneAllowed.value;
  return (
    <Box
      w={currentSize}
      h={currentSize}
      sx={{
        transition: "all 200ms linear",
        borderRadius: isRecording ? 10 : "50%",
        background: isMicAvailable ? "red" : "gray",
      }}
      onClick={async () => {
        if (!isMicAvailable) {
          notifications.show({
            title: "Permission Error",
            message:
              "Please allow access to your microphone on website settings, and refresh the page",
            color: "red",
          });
          return;
        }
        const nextState = !isRecording;
        await onClick(nextState);
        setIsRecording(nextState);
      }}
    />
  );
};
