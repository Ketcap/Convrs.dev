import { Alert, Text } from "@mantine/core";
import { useSignal } from "@preact/signals-react";

export const AppUpdateAlert = () => {
  const show = useSignal(true);
  if (!show.value) return null;
  return (
    <Alert
      title="We have new domain!"
      variant="filled"
      withCloseButton
      onClose={() => (show.value = false)}
    >
      <Text>
        {`We have updated the domain of our project to`}{" "}
        <Text span fw={600} inherit>
          {"`convrs.dev`"}
        </Text>
        {`, you are
            redirected to the new domain. All the conversations are still
            available. It's only the domain that has changed.`}
      </Text>
    </Alert>
  );
};
