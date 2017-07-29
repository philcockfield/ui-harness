import { React, constants } from '../common';
import * as state from '../state';
require('../specs.js');


export default () => {
  return <Page />;
};




export interface IPageProps { }
export interface IPageState {
  specs: object;
}
export class Page extends React.Component<IPageProps, IPageState> {
  public state = {
    specs: {},
  };


  public render() {
    console.log('RENDER constants.GLOBAL.FOO', constants.GLOBAL.FOO);
    return (
      <div>
        <h1>UIHarness</h1>
        <div>constants.SPECS</div>
        <pre>{JSON.stringify(constants.SPECS, null, '  ')}</pre>
        <hr />
        <div>this.state.specs</div>
        <pre>{JSON.stringify(this.state.specs, null, '  ')}</pre>
        <div>
          <a href='/foo'>/foo</a>
        </div>
        <img src='/images/monkey.jpg' />
      </div>
    );
  }
}
