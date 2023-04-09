import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";
import NextApp, { AppContext, AppProps, AppInitialProps } from "next/app";
import Head from "next/head";
import nookies from "nookies";
import { useSignal } from "@preact/signals-react";
import { IconSearch } from "@tabler/icons-react";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";

import { trpc } from "@/lib/trpcClient";
import { basicActions } from "@/components/Spotlight/actions";
import { Authentication } from "@/components/Authenticatioon";
import { Spotlight } from "@/components/Spotlight";

import "@/styles/global.css";
import { styleCache } from "@/lib/style";

function App({ Component, pageProps }: AppProps<{ colorScheme: ColorScheme }>) {
  const actions = useSignal<SpotlightAction[]>(basicActions);
  const colorSchemeState = useSignal<ColorScheme>(pageProps.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    colorSchemeState.value =
      value || (colorSchemeState.value === "dark" ? "light" : "dark");

    nookies.set(null, "mantine-color-scheme", colorSchemeState.value);
  };

  return (
    <>
      <Head>
        <title>Convrs.dev | AI that speaks</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorSchemeState.value}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme: colorSchemeState.value }}
          withGlobalStyles
          withNormalizeCSS
          emotionCache={styleCache}
        >
          <SpotlightProvider
            shortcut={["/", "mod + /"]}
            actions={actions.value}
            onActionsChange={(newActions) => (actions.value = newActions)}
            searchIcon={<IconSearch size="1.2rem" />}
            searchPlaceholder="Search..."
            nothingFoundMessage="Nothing found..."
          >
            <Spotlight />
            <Notifications position="top-right" />
            <Component {...pageProps} />
            <Authentication />
          </SpotlightProvider>
        </MantineProvider>
        <Analytics />
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (
  appContext: AppContext
): Promise<AppInitialProps> => {
  const appProps = await NextApp.getInitialProps(appContext);
  const cookies = nookies.get(appContext.ctx);
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      colorScheme: cookies["mantine-color-scheme"] || "light",
    },
  };
};

export default trpc.withTRPC(App);
