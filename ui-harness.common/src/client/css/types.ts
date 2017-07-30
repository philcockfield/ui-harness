import { CSSProperties } from 'glamor';
import { transformStyle } from './css';


export interface IImageOptions {
  width?: number;
  height?: number;
}


export interface IBackgroundImageStyles {
  backgroundImage: string;
  width?: number;
  height?: number;
  backgroundSize: string;
  backgroundRepeat: string;
}


export type FormatImage = (
  image1x: string | undefined,
  image2x: string | undefined,
  options?: IImageOptions,
) => IBackgroundImageStyles;


export type Falsy = undefined | null | false;
export class GlamorValue { }
export interface IFormatCss {
  (...styles: Array<React.CSSProperties | GlamorValue | Falsy>): GlamorValue;
  image: FormatImage;
}


export type CssProps = CSSProperties;
export type ClassName = (...styles: Array<CssProps | undefined>) => string;



export interface IStyle extends IFormatCss {
  className: ClassName;
  transform: typeof transformStyle;
  merge: (...rules: any[]) => CssProps;
}
