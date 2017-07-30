import { React, constants, delay } from '../common';
import * as state from '../state';
import '../generated/specs.g';

// import { React, Document, Head, Main, NextScript } from '../common';
// const glamor = require('glamor/server');



export interface IPageProps {
  suites: object;
}
export interface IPageState {
  suites: object;
}
export default class Page extends React.Component<IPageProps, IPageState> {
  // public static async getInitialProps(props: any) {
  //   console.log('pages/index:getInitialProps!!! ---------');
  //   return { suites: constants.SUITES };
  // }

  public state: IPageState = {
    suites: {},
  };


  public componentWillMount() {
    this.setState({ suites: this.props.suites });
  }
  public componentDidMount() {
    this.updateState();
  }
  // public componentWillReceiveProps(nextProps) {}
  // public shouldComponentUpdate(nextProps, nextState) {}
  public async componentWillUpdate(nextProps: any, nextState: any) {
    console.log('!! pages/index:componentWillUpdate');
    // this.updateState();

  }

  private async updateState() {
    // NB: Client state only.
    // Avoids React errors on hot-module updates.
    delay(0, () => {
      this.setState({
        suites: constants.SUITES,
      });
    });
  }
  // public componentDidUpdate(prevProps, prevState) {}
  // public componentWillUnmount() {}

  public render() {
    const { suites } = this.props;
    return (
      <div>
        <h1>UIHarness</h1>
        <div>this.state.suites</div>
        <pre>{JSON.stringify(this.state.suites, null, '  ')}</pre>
        <hr />
        <div>
          <a href='/foo'>/foo</a>
        </div>
        <img src='/images/monkey.jpg' height={180} />
      </div>
    );
  }
}
