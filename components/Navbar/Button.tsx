import { Group, UnstyledButton } from "@mantine/core";

export interface ButtonProps {
  children: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
  label: string;
}
export const Button = ({ label, children, right, onClick }: ButtonProps) => {
  return (
    <UnstyledButton
      aria-label={label}
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
