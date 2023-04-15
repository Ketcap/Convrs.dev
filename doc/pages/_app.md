### `function App({ Component, pageProps }: AppProps<{ colorScheme: ColorScheme }>): JSX.Element`

This is the main component of the Next.js application. It is responsible for rendering all the components and pages of the application. 

#### Parameters
- `Component`: A React component that represents the current page.
- `pageProps`: An object that contains the initial props that were preloaded for the current page.

#### Returns
- A JSX element that represents the entire application.

#### Children
- `Head`: A React component that sets the metadata of the page.
- `ColorSchemeProvider`: A React component that provides the color scheme for the application.
- `MantineProvider`: A React component that provides the Mantine theme for the application.
- `SpotlightProvider`: A React component that provides the spotlight search functionality for the application.
- `Notifications`: A React component that displays notifications.
- `Component`: A React component that represents the current page.
- `Authentication`: A React component that handles authentication.
- `Spotlight`: A React component that displays the spotlight search results.

#### Dependencies
- `@mantine/core`
- `@mantine/notifications`
- `@vercel/analytics/react`
- `next/app`
- `next/head`
- `nookies`
- `@preact/signals-react`
- `@tabler/icons-react`
- `@mantine/spotlight`
- `@/lib/trpcClient`
- `@/components/Spotlight/actions`
- `@/components/Authenticatioon`
- `@/components/Spotlight`
- `@/styles/global.css`
- `@/lib/style`