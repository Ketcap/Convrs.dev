import { Navbar as MantineNavbar } from "@mantine/core";

export const Navbar = () => {
  return (
    <MantineNavbar height="100%" p="xs" width={{ base: 300 }}>
      <MantineNavbar.Section grow>something</MantineNavbar.Section>
    </MantineNavbar>
  );
};
