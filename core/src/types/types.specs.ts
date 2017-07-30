import { React } from '../common/libs';


export interface ISuites {
  [key: string]: ISuite;
}


export interface ISuite {
  id: string;
  update: number;
  modulePath: string;
  name: string;
  route?: string;
  specs: ISpec[];
}

export interface IDescribeOptions {
  route?: string;
}

export interface IDescribe extends IDescribeOptions {
  suite: ISuite;
  add: (name: string, func: SpecFunction) => IDescribe;
}


export interface ISpecOptions { }
export type SpecFunction = React.ReactNode | Promise<React.ReactNode>;
export interface ISpec {
  name: string;
  func: SpecFunction;
}
