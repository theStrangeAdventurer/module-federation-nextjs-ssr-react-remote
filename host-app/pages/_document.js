import Document, { Html, Head, Main, NextScript } from 'next/document';
import {
  revalidate,
} from '@module-federation/nextjs-mf/utils';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    ctx?.res?.on("finish", () => {
      console.time('revalidate');
      revalidate().finally(() => {
        console.timeEnd('revalidate');
      })
    });
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
