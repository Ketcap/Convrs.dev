import { Avatar } from "@mantine/core";

export interface AIAvatarProps {
  src: string;
}
export const AIAvatar = ({ src = "/ai-5.png" }: AIAvatarProps) => (
  <Avatar src={src} bg="#f2f2f2" radius="xl" sx={{ display: "inline-flex" }} />
);
