import { React, next } from '../../common';


export interface IHeadProps {
  title?: string;
  css?: string;
}


export const Head = (props: IHeadProps) => {
  const style = props.css && <style dangerouslySetInnerHTML={{ __html: props.css }} />;
  return (
    <next.Head>
      <title>{props.title || 'UIHarness'}</title>
      <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:100,300,300i,400,400i,900' />
      <link rel='stylesheet' type='text/css' href='/css/normalize.css' />
      <link rel='stylesheet' type='text/css' href='/css/global.css' />
      {style}
    </next.Head>
  );
};
