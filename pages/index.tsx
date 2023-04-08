import { Center, Grid, Stack, Title } from "@mantine/core";
import { InfoCard } from "@/components/InfoCard";
import { Layout } from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <Center sx={{ height: "100%" }}>
        <Stack>
          <Center>
            <Title>Convrs.dev</Title>
          </Center>
          <Grid gutter="md" p="lg">
            <Grid.Col span={4} mih={75}>
              <InfoCard
                title="Check your configuration"
                description="Make sure you have correctly setup your OpenAI Key to start using Convrs.dev"
              />
            </Grid.Col>
            <Grid.Col span={4} mih={75}>
              <InfoCard
                title="Voice"
                description="Don't forget you can use your voice to talk to AI."
              />
            </Grid.Col>
            <Grid.Col span={4} mih={75}>
              <InfoCard
                title="Personal Information"
                description="We do not put any of your personal information in the chat."
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Center>
    </Layout>
  );
}
