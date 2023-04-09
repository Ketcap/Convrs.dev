import Document, {
  DocumentContext,
  Html,
  Main,
  NextScript,
  Head,
} from "next/document";
import { ServerStyles, createStylesServer } from "@mantine/next";

import { styleCache } from "../lib/style";

const serverStyles = createStylesServer(styleCache);

const CustomDocument = () => (
  <Html lang="en">
    <Head>
      <meta
        name="description"
        content="AI that speaks | Convrs.dev | Create AI rooms to access OpenAI with more functionality"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

CustomDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <ServerStyles html={initialProps.html} server={serverStyles} />
      </>
    ),
  };
};

export default CustomDocument;
