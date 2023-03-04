import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      <AppShell padding="md" header={<Header />}>
        <Component {...pageProps} />
      </AppShell>
    </MantineProvider>
  );
}
