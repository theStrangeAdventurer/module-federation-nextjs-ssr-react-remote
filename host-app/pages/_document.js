import Document, { Html, Head, Main, NextScript } from 'next/document';
import {
  revalidate,
} from '@module-federation/nextjs-mf/utils';
import { performReload } from '@module-federation/node/utils';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    await revalidate().then(shouldReload => {
      console.log("performReload", shouldReload);
      performReload(shouldReload);
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
