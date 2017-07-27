// import * as React from 'react';
// import Document, { Head, Main, NextScript } from 'next/document';
// const glamor = require('glamor/server');


// export default class MyDocument extends Document {
//   public static async getInitialProps({ req, renderPage, query }: any) {
//     const isDev = req.headers.host.startsWith('localhost');
//     const options = { isDev };
//     const page = renderPage();
//     const styles = glamor.renderStatic(() => page.html);
//     return { ...page, ...styles, ...options };
//   }

//   public render() {
//     const props = this.props as any;
//     return (
//       <html>
//         <Head>
//           <title>Example</title>
//           <meta name='viewport' content='width=device-width, initial-scale=1' />
//           <link rel='icon' type='image/x-icon' href={`/favicon.ico`} />
//           <link href={`/css/normalize.css`} rel='stylesheet' />
//           <link href={`/css/global.css`} rel='stylesheet' />
//           <style dangerouslySetInnerHTML={{ __html: props.css }} />
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </html>
//     );
//   }
// }

