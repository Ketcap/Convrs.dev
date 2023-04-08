import { Paper, Space, Text, Title } from "@mantine/core";

export interface InforCardProps {
  title: string;
  description: React.ReactNode;
}

export const InfoCard = ({ title, description }: InforCardProps) => {
  return (
    <Paper shadow="md" radius="md" p="md" h={"100%"}>
      <Title order={3} weight={500}>
        {title}
      </Title>
      <Space h="md" />
      <Text color="dimmed">{description}</Text>
    </Paper>
  );
};
