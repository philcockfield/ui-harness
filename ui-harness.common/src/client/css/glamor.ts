/**
 * See:
 *   https://github.com/threepointone/glamor
 */
import { style, merge } from 'glamor';
import { CssProps } from './types';
import { format } from './css';

export { merge };

/**
 * Converts a set of properties into hashed CSS class-names.
 */
export function className(...styles: Array<CssProps | undefined>): string {
  const names = styles.map((s) => style(format(s) as CssProps));
  return `${merge(names)}`;
}
