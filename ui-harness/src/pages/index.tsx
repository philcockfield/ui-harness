import { React, constants, delay } from '../common';
import { ISuites } from '../types';
import * as state from '../state';
import '../generated/specs.g';




export interface IPageProps {
  suites: ISuites;
}
export interface IPageState {
  suites: ISuites;
}
export default class Page extends React.Component<IPageProps, IPageState> {
  public state: IPageState = {
    suites: {},
  };

  public static async getInitialProps(props: any) {
    return {
      suites: constants.SUITES,
    };
  }


  public componentWillMount() {
    this.setState({ suites: this.props.suites });
  }
  public componentDidMount() {
    this.updateState();
  }


  private async updateState() {
    // NOTE:  Client-side only.
    //        Avoids React "out of date" errors on hot-module
    //        updates when changed from server-render.
    delay(0, () => {
      this.setState({
        suites: constants.SUITES,
      });
    });
  }


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
        <img src='/images/monkey.jpg' height={280} />
      </div>
    );
  }
}
