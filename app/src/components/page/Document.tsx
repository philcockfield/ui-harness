import { React, next } from '../../common';
import { Head } from './Head';
const glamor = require('glamor/server');


export interface IPageProps {
  title?: string;
  css?: string;
}


export class Document extends next.Document<IPageProps> {
  /**
   * Server hydration of state and CSS.
   */
  public static async getInitialProps({ req, renderPage, query }: any) {
    const page = renderPage();
    const styles = glamor.renderStatic(() => page.html);
    return { ...page, ...styles };
  }


  public render() {
    return (
      <html>
        <Head
          title={this.props.title}
          css={this.props.css}
        />
        <body>
          <next.Main />
          <next.NextScript />
        </body>
      </html>
    );
  }
}

