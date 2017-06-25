import * as React from 'react';


/*
 UIHarness type definitions for now 
*/

type UIComponentType = React.ReactElement<{}> | React.Component<{}, {}> | React.StatelessComponent<{}> | string;
declare class IUIHarnessContext {
  public component: (component: UIComponentType) => this;
  public header: (title: string) => this;
}

type ActionType = (this: IUIHarnessContext) => void;
type BDDType = (labelOrAction: string | ActionType, action?: ActionType) => void;

declare var describe: BDDType;
declare var before: BDDType;
declare var section: BDDType;
declare var it: BDDType;

/* Type definitions end */





// tslint:disable-next-line
// Using class as enums cannot use strings. http://stackoverflow.com/questions/15490560/create-an-enum-with-string-values-in-typescript
class UIBGColors {
  public static normal: string = '#2196F3';
  public static light: string = '#64B5F6';
  public static dark: string = '#1976D2';
}

interface ITypeScriptComponentProps {
  color?: UIBGColors;
}

const TypeScriptComponent = ({
  color = UIBGColors.normal,
}: ITypeScriptComponentProps) => {
  const style: React.CSSProperties = {
    backgroundColor: color,
    height: 200,
    width: 200,
  };

  return <div style={ style } />;
};

describe('TypeScript', function (this: IUIHarnessContext): void {
  // Temporary fix until UIHarness core is typed correctly
  const self: IUIHarnessContext = this;
  self.header(`## A React component written in TypeScript.`);

  before(() => this.component(<TypeScriptComponent />));

  it(
    '`component(<TypeScriptComponent/>)`',
    () => this.component(<TypeScriptComponent />)
  );

  it(
    'light background',
    () => this.component(<TypeScriptComponent color={ UIBGColors.light } />)
  );

  it(
    'dark background',
    () => this.component(<TypeScriptComponent color={ UIBGColors.dark } />)
  );

  it(
    'normal background',
    () => this.component(<TypeScriptComponent color={ UIBGColors.normal } />)
  );

});
