import { GlamorValue, CssProps, IStyle } from './types';
import { format, transformStyle } from './css';
import { className, merge } from './glamor';

const api = (format as any);
api.className = className;
api.merge = merge;
api.transform = transformStyle;

export { GlamorValue, CssProps };
export const css = format as IStyle;
