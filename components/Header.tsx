import { Burger, Group, Header as MantineHeader } from "@mantine/core";
import Image from "next/image";

export const Header = () => {
  return (
    <MantineHeader height={60}>
      <Group>
        <Image src="/logo.png" width={45} height={55} alt="Talk to AI logo" />
      </Group>
    </MantineHeader>
  );
};
