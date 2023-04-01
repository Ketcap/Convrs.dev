import { Alert, Box, MantineProvider } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";
import { Notifications } from "@mantine/notifications";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";

import "@/styles/global.css";
import { Navbar } from "../components/Navbar/Navbar";
import { Authentication } from "../components/Authenticatioon";
import { trpc } from "../lib/trpcClient";
import { AppUpdateAlert } from "../components/AppUpdateAlert";

function App({ Component, pageProps, ...rest }: AppProps) {
  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications position="top-right" />

        <Box w={"100%"} sx={{ display: "flex", flexDirection: "column" }} p={0}>
          <Header />
          <Box sx={{ display: "flex", flex: 1 }}>
            <Box pos="relative" bg="#fff">
              <Navbar />
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                background: "#fff",
                flexDirection: "column",
              }}
              pos="relative"
              p="md"
            >
              <AppUpdateAlert />
              <Component {...pageProps} />
            </Box>
          </Box>
        </Box>
        <Authentication />
      </MantineProvider>
      <Analytics />
    </>
  );
}

export default trpc.withTRPC(App);
