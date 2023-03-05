import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";

import "@/styles/global.css";
import { Navbar } from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <Notifications position="top-right" />
      <AppShell padding="md" header={<Header />} navbar={<Navbar />}>
        <Component {...pageProps} />
      </AppShell>
    </MantineProvider>
  );
}
