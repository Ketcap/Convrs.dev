import { Group, UnstyledButton } from "@mantine/core";

export interface ButtonProps {
  children: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
}
export const Button = ({ children, right, onClick }: ButtonProps) => {
  return (
    <UnstyledButton
      p="sm"
      onClick={onClick}
      sx={{
        borderRadius: 8,
        ":hover": {
          background: "#343540",
        },
      }}
    >
      <Group position="apart">
        {children}
        {right}
      </Group>
    </UnstyledButton>
  );
};

// #C5C5D1
