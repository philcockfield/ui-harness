import { React, css } from '../../common';

export interface IFooProps { }

/**
 * primitive
 */
export class Foo extends React.Component<IFooProps, {}> {
  public render() {
    const styles = {
      base: css({
        backgroundColor: 'rgba(255, 0, 0, 0.1)', /* RED */
        padding: 50,
      }),
    };
    return (
      <div {...styles.base}>Foo</div>
    );
  }
}
