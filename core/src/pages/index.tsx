import { React, constants } from '../common';
import * as state from '../state';
import '../specs.generated';



export interface IPageProps {
  specs: object;
}
export interface IPageState {
}
export default class Page extends React.Component<IPageProps, IPageState> {
  public state = {
  };


  public static async getInitialProps(props: any) {
    return { suits: constants.SUITES };
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
    const { specs } = this.props;
    return (
      <div>
        <h1>UIHarness</h1>
        <div>constants.SUITES</div>
        <pre>{JSON.stringify(constants.SUITES, null, '  ')}</pre>
        <hr />
        <div>props.specs</div>
        <pre>{JSON.stringify(specs, null, '  ')}</pre>
        <div>
          <a href='/foo'>/foo</a>
        </div>
        <img src='/images/monkey.jpg' />
      </div>
    );
  }
}
