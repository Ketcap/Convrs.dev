import { Center, Grid, Stack, Title } from "@mantine/core";
import { InfoCard } from "@/components/InfoCard";
import { Layout } from "@/components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <Center sx={{ height: "100%" }}>
        <Stack>
          <Center>
            <Title>Convrs.dev</Title>
          </Center>
          <Grid gutter="md" p="lg">
            <Grid.Col span={12}>
              <InfoCard
                title="Open Source"
                description={
                  <>
                    {
                      "This project is available for you to review, give feedback and contribute."
                    }
                    <Link href="https://github.com/Ketcap/Convrs.dev">
                      Convrs.dev
                    </Link>
                  </>
                }
              />
            </Grid.Col>
          </Grid>
          <Grid gutter="md" p="lg">
            <Grid.Col span={12} md={4} mih={75}>
              <InfoCard
                title="Check your configuration"
                description="Make sure you have correctly setup your OpenAI Key to start using Convrs.dev"
              />
            </Grid.Col>
            <Grid.Col span={12} md={4} mih={75}>
              <InfoCard
                title="Voice"
                description="Don't forget you can use your voice to talk to AI."
              />
            </Grid.Col>
            <Grid.Col span={12} md={4} mih={75}>
              <InfoCard
                title="Personal Information"
                description="Please do not put any of your personal information in the chat."
              />
            </Grid.Col>
          </Grid>
          <Grid gutter="md" p="lg">
            <Grid.Col span={12}>
              <InfoCard
                title="Quick actions"
                description="Quick actions could be used by clicking '/' on your keyboard."
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Center>
    </Layout>
  );
}
