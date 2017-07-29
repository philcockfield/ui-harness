import { React, constants } from '../common';
import * as state from '../state';
import '../specs.generated';

// import { React, Document, Head, Main, NextScript } from '../common';
// const glamor = require('glamor/server');



export interface IPageProps {
  suites: object;
}
export default class Page extends React.Component<IPageProps, {}> {
  public static async getInitialProps(props: any) {

    console.log('getInitialProps!!! ---------');

    return { suites: constants.SUITES };
  }


  // public componentWillMount() {}
  // public componentDidMount() {}
  // public componentWillReceiveProps(nextProps) {}
  // public shouldComponentUpdate(nextProps, nextState) {}
  public componentWillUpdate(nextProps: any, nextState: any) {
    console.log('!! componentWillUpdate');
  }
  // public componentDidUpdate(prevProps, prevState) {}
  // public componentWillUnmount() {}

  public render() {
    const { suites } = this.props;
    return (
      <div>
        <h1>UIHarness</h1>
        <div>constants.SUITES</div>
        <pre>{JSON.stringify(constants.SUITES, null, '  ')}</pre>
        <hr />
        <div>props.suites</div>
        <pre>{JSON.stringify(suites, null, '  ')}</pre>
        <div>
          <a href='/foo'>/foo</a>
        </div>
        <img src='/images/monkey.jpg' />
      </div>
    );
  }
}
