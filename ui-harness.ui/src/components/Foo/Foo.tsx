import { React } from '../../common';

export interface IFooProps { }

/**
 * primitive
 */
export class Foo extends React.Component<IFooProps, {}> {
  public render() {
    return (
      <div>Foo</div>
    );
  }
}
