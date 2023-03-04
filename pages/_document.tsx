import { Head, Html, Main, NextScript } from "next/document";

const CustomDocument = () => (
  <Html>
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default CustomDocument;
