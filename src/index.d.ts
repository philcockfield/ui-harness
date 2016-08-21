
declare namespace UIHarness {
    import React = __React;
    type IUIHComponent = React.ReactElement<{}> | React.Component<{}, {}> | React.StatelessComponent<{}> | string;

    interface ICropMarks {
        (enabled: boolean): IUIHarnessContext;
        size(value: number): IUIHarnessContext;
        offset(value: number): IUIHarnessContext;
    }

    class IUIHarnessContext {
        public toValues(): {};
        public reset(options: {}): void;
        public props(value: {}): {};
        public context(value: {}): {};
        public component(component: IUIHComponent): this;
        public unload(): this;

        public log(...value: any[]): this;

        // property setters
        public children(children: React.ReactType[] | React.ReactType): this;
        public childContextTypes(value: {}): this;
        public width(value: string | number): this;
        public height(value: string | number): this;
        public cropMarks: ICropMarks; // tslint:disable-line:member-ordering
        public margin(value: number): this;
        public align(value: string): this; // TODO: Type this.align() better
        public header(value: string): this;
        public footer(value: string): this;
        public hr(enabled: boolean): this;
        public backdrop(value: string | number): this;
        public background(value: string | number): this;
        public scroll(value: boolean | 'x' | 'y' | 'x:y'): this;
        public style(value: React.CSSProperties): this;
    }

    interface IActionType { (this: IUIHarnessContext): void; }

    interface IBDDFunction {
        (label: string, action?: IActionType): void;
        (action: IActionType): void;
    }

}

export declare var describe: UIHarness.IBDDFunction;
export declare var before: UIHarness.IBDDFunction;
export declare var section: UIHarness.IBDDFunction;
export declare var it: UIHarness.IBDDFunction;

declare var defaultExport: { start: any, build: any };
export default defaultExport;

