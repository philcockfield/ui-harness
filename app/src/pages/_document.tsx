import { React, Document, Head, Main, NextScript } from '../common';
const glamor = require('glamor/server');


export default class RootDocument extends Document {
  public static async getInitialProps({ req, renderPage, query }: any) {
    // Flush glamour CSS.
    const page = renderPage();
    const styles = glamor.renderStatic(() => page.html);
    return { ...page, ...styles };
  }

  public render() {
    const props = this.props as any;
    return (
      <html>
        <Head>
          <title>Example</title>
          <link rel='icon' type='image/x-icon' href={`/@uiharness/favicon.ico`} />
          <link href={`/@uiharness/css/normalize.css`} rel='stylesheet' />
          <style dangerouslySetInnerHTML={{ __html: props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

