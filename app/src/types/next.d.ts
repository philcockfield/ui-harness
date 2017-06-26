// tslint:disable

// Type definitions for next 2.0
// Project: https://github.com/zeit/next.js#readme
// Definitions by: Juan Placencia <https://github.com/jupl>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

declare module 'next' {
  import { Server, ServerOptions } from 'next/server';
  export { Server }
  export = next;
  namespace next { }
  function next(opts: ServerOptions): Server;
  function next(path: string, opts: ServerOptions): Server;
}

declare module 'next/document' {
  import { InitialProps } from 'next/page';
  import { Component } from 'react';
  export default class Document<T> extends Component<DocumentProps<T>, {}> { }
  export class Main extends Component<{}, {}> { }
  export class Head extends Component<{}, {}> { }
  export class NextScript extends Component<{}, {}> { }
  export interface InitialProps extends InitialProps {
    renderPage(): DocumentProps<{}>;
  }
  export type DocumentProps<T extends {}> = T & {
    html?: string
    head: string
    errorHtml: string,
  };
}

declare module 'next/head' {
  import { Component } from 'react';
  export default class Head extends Component<{}, {}> { }
}

declare module 'next/link' {
  import { Component } from 'react';
  import { Url } from 'url';
  export default class Link extends Component<LinkProps, {}> { }
  export interface LinkProps {
    prefetch?: boolean;
    replace?: boolean;
    href: string | Url;
  }
}

declare module 'next/page' {
  import { IncomingMessage, ServerResponse } from 'http';
  export interface InitialProps {
    pathname: string;
    query: any;
    req?: IncomingMessage;
    res?: ServerResponse;
    jsonPageRes?: Response;
    err?: Error;
  }
}

declare module 'next/router' {
  import { Url } from 'url';
  const router: Router;
  export default router;
  export interface RoutingOptions {
    shallow: boolean;
  }
  export interface RouteChangeError extends Error {
    cancelled: boolean;
  }
  export interface Router {
    route: string;
    pathname: string;
    query: any;
    push(url: string | Url, pushAs?: string | Url, opts?: RoutingOptions): void;
    replace(url: string | Url, replaceAs?: string | Url, opts?: RoutingOptions): void;
    prefetch(url: string | Url): void;
    onRouteChangeStart(url: string): void;
    onRouteChangeComplete(url: string): void;
    onRouteChangeError(err: RouteChangeError, url: string): void;
    onBeforeHistoryChange(url: string): void;
    onAppUpdated(nextUrl: string): void;
  }
}

declare module 'next/server' {
  import { IncomingMessage, ServerResponse } from 'http';
  import { Url } from 'url';
  export interface Server {
    render(req: IncomingMessage, res: ServerResponse, pathname?: string, query?: string | any): void;
    getRequestHandler(): RequestHandler;
    prepare(): Promise<void>;
  }
  export interface ServerOptions {
    dev?: boolean;
    dir?: string;
    quiet?: boolean;
  }
  export type RequestHandler = (req: IncomingMessage, res: ServerResponse, parsedUrl?: Url) => Promise<void>;
}
