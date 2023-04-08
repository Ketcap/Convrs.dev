import {
  Avatar,
  AvatarProps,
  Group,
  LoadingOverlay,
  Select,
  Text,
} from "@mantine/core";
import { useSignal } from "@preact/signals-react";
import { forwardRef } from "react";

// Arrays start from 0 :D
const images = new Array(29).fill("").map((_, i) => ({
  image: `ai-${i + 1}.png`,
  label: `AI ${i + 1}`,
  value: `ai-${i + 1}.png`,
}));

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={`/ai/${image}`} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);
SelectItem.displayName = "AvatarSelectItem";

export interface AvatarSelectProps {
  value?: string;
  onChange: (avatar: string) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: AvatarProps["size"];
}

export const AvatarSelect = ({
  value,
  onChange,
  disabled,
  loading,
  size = "xl",
}: AvatarSelectProps) => {
  const selectedAvatar = useSignal(value);
  return (
    <Group pos={"relative"} position="apart">
      <Avatar src={`/ai/${selectedAvatar.value}`} radius="xl" size={size} />
      <LoadingOverlay visible={loading ?? false} />
      <Select
        disabled={disabled}
        withinPortal
        placeholder="Pick one"
        itemComponent={SelectItem}
        data={images}
        value={selectedAvatar.value}
        maxDropdownHeight={400}
        nothingFound="Nobody here"
        onChange={(value) => {
          if (value && value !== selectedAvatar.value) {
            selectedAvatar.value = value;
            onChange(value);
          }
        }}
        filter={(value, item) =>
          item.label?.toLowerCase().includes(value.toLowerCase().trim()) ??
          false
        }
      />
    </Group>
  );
};
