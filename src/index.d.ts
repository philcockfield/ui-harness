
declare namespace UIHarness {
    import React = __React;
    type IUIHComponent = React.ReactElement<{}> | React.Component<{}, {}> | React.StatelessComponent<{}> | string;

    interface ICropMarks {
        (enabled: boolean): IUIHarnessContext;
        size(value: number): IUIHarnessContext;
        offset(value: number): IUIHarnessContext;
    }

    class IUIHarnessContext {
        toValues(): {};
        reset(options: {}): void;
        props(value: {}): {};
        context(value: {}): {};
        component(component: IUIHComponent): this;
        unload(): this;
        
        log(...value: any[]): this;
        
        // property setters
        children(children: React.ReactType[] | React.ReactType): this;
        childContextTypes(value: {}): this;
        width(value: string | number): this;
        height(value: string | number): this;
        cropMarks: ICropMarks;
        margin(value: number): this;
        align(value: string): this; // TODO: Type this.align() better
        header(value: string): this;
        footer(value: string): this;
        hr(enabled: boolean): this;
        backdrop(value: string | number): this;
        background(value: string | number): this;
        scroll(value: boolean | 'x' | 'y' | 'x:y'): this;
        style(value: React.CSSProperties): this;
    }
    var UIHarness: IUIHarnessContext;

    interface ActionType { (this: IUIHarnessContext): void; }
    
    interface IBDDFunction {
        (label: string, action?: ActionType): void;
        (action: ActionType): void;
    }



}
declare var describe: UIHarness.IBDDFunction;
declare var before: UIHarness.IBDDFunction;
declare var section: UIHarness.IBDDFunction;
declare var it: UIHarness.IBDDFunction;

