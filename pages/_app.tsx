import { AppShell, Box, Container, Grid, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";

import "@/styles/global.css";
import { Navbar } from "../components/Navbar/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      <Container sx={{ display: "flex", flexDirection: "column" }}>
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
            <Component {...pageProps} />
          </Box>
        </Box>
      </Container>
    </MantineProvider>
  );
}
