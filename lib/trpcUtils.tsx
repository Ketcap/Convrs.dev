import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { TRPCClientErrorBase } from "@trpc/client";

export const onErrorHandler = (err: TRPCClientErrorBase<any>) => {
  showNotification({
    message: err.message,
    icon: <IconX enableBackground={10} />,
    radius: "lg",
    color: "red",
  });
};
