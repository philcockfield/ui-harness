import * as R from 'ramda';
import { value as valueUtil } from '../value';
import { IFormatCss, IImageOptions, IBackgroundImageStyles } from './types';


export const MEDIA_QUERY_RETINA = `@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)`;



/**
 * Constructs a style object for an image.
 *
 *    For turning image files (PNG/JPG/SVG) into data-uri's see:
 *    https://github.com/webpack/url-loader
 *
 * @param {string} image1x: The normal image resolution (base64 encoded)
 * @param {string} image2x: The retina image resolution (base64 encoded)
 * @param {integer} width: Optional. The width of the image.
 * @param {integer} height: Optional. The height of the image.
 */
export const image = (
  image1x: string | undefined,
  image2x: string | undefined,
  options: IImageOptions = { width: 10, height: 10 },
): IBackgroundImageStyles => {

  // Prepare image based on current screen density.
  if (!image1x) { throw new Error('Must have at least a 1x image.'); }
  const { width, height } = options;
  const result: any = {
    width,
    height,
    backgroundImage: `url(${image1x})`,
    backgroundSize: `${width}px ${height}px`,
    backgroundRepeat: 'no-repeat',
  };


  if (image2x) {
    result[ MEDIA_QUERY_RETINA ] = {
      backgroundImage: `url(${image2x})`,
    };
  }

  // Finish up.
  return result;
};



const mergeAndReplace = (key: string, value: any, target: any) => {
  Object.assign(target, value);
  delete target[ key ];
  return target;
};



const formatImage = (
  key: string,
  value: Array<string | number | undefined>,
  target: any,
) => {
  // Wrangle parameters.
  let [ image1x, image2x, width, height ] = value; // tslint:disable-line

  if (R.is(Number, image2x)) {
    height = width;
    width = image2x;
    image2x = undefined;
  }
  const options = {
    width: width as number,
    height: height as number,
  };
  const style = image(image1x as string, image2x as string, options);
  mergeAndReplace(key, style, target);
};





export const toPositionEdges = (
  key: string,
  value: any = undefined,
): {
  position: string,
  top: number | void, right: number | void, bottom: number | void, left: number | void,
} | void => {

  if (value === undefined || value === null) { return undefined; }
  if (R.is(String, value) && valueUtil.isBlank(value)) { return undefined; }
  if (R.is(Array, value) && value.length === 0) { return undefined; }
  if (!R.is(Array, value)) {
    value = value.toString().split(' ');
  }
  const edges = value.map((item: any) => valueUtil.toNumber(item));
  let top: number | void;
  let right: number | void;
  let bottom: number | void;
  let left: number | void;

  const getEdge = (index: number): number | void => {
    const edge = edges[ index ];
    if (edge === null || edge === 'null' || edge === '') { return undefined; }
    return edge;
  };

  switch (edges.length) {
    case 1:
      top = getEdge(0);
      bottom = getEdge(0);
      left = getEdge(0);
      right = getEdge(0);
      break;

    case 2:
      top = getEdge(0);
      bottom = getEdge(0);
      left = getEdge(1);
      right = getEdge(1);
      break;

    case 3:
      top = getEdge(0);
      left = getEdge(1);
      right = getEdge(1);
      bottom = getEdge(2);
      break;

    default:
      top = getEdge(0);
      right = getEdge(1);
      bottom = getEdge(2);
      left = getEdge(3);
  }

  if (top === undefined && right === undefined && bottom === undefined && left === undefined) {
    return undefined;
  }
  return {
    position: key.toLowerCase(),
    top, right, bottom, left,
  };
};


export const formatPositionEdges = (key: string, target: any) => {
  const styles = toPositionEdges(key, target[ key ]);
  mergeAndReplace(key, styles, target);
};


/**
 * AbsoluteCenter
 *      - x
 *      - y
 *      - xy
 */
const formatAbsoluteCenter = (key: string, value: string | boolean | number, target: any) => {
  if (value === true) { value = 'xy'; }
  if (value === false || value === undefined || value === null) { return; }
  const styles = {
    position: 'absolute',
    left: target.left,
    top: target.top,
    transform: '',
  };
  const stringValue = value.toString().trim().toLowerCase();
  if (stringValue.includes('x')) { styles.left = '50%'; }
  if (stringValue.includes('y')) { styles.top = '50%'; }
  let transform: string;
  switch (value) {
    case 'yx':
    case 'xy': transform = 'translate(-50%, -50%)'; break;
    case 'x': transform = 'translateX(-50%)'; break;
    case 'y': transform = 'translateY(-50%)'; break;
    default: throw new Error(`AbsoluteCenter value '${value}' not supported.`);
  }
  styles.transform = `${target.transform || ''} ${transform}`.trim();
  mergeAndReplace(key, styles, target);
};




/**
 * Spacing on the X:Y plane.
 */
function formatSpacingPlane(plane: 'x' | 'y', prefix: 'margin' | 'padding', key: string, value: any, target: any) {
  const styles = {};

  switch (plane) {
    case 'x':
      styles[ `${prefix}Left` ] = value;
      styles[ `${prefix}Right` ] = value;
      break;

    case 'y':
      styles[ `${prefix}Top` ] = value;
      styles[ `${prefix}Bottom` ] = value;
      break;

    default:
      break; // Ignore.
  }

  mergeAndReplace(key, styles, target);
}


// --------------------------------------------------


const AlignMap: { [ k: string ]: string } = {
  center: 'center',
  left: 'flex-start',
  top: 'flex-start',
  start: 'flex-start',
  right: 'flex-end',
  bottom: 'flex-end',
  end: 'flex-end',
  full: 'stretch',
  stretch: 'stretch',
  baseline: 'baseline',
};
function convertCrossAlignToFlex(token: string): string | undefined {
  return AlignMap[ token ] || undefined; // undefined if not recognised;
}

const MainAlignMap: { [ k: string ]: string } = {
  center: 'center',
  left: 'flex-start',
  top: 'flex-start',
  start: 'flex-start',
  right: 'flex-end',
  bottom: 'flex-end',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
};
function convertMainAlignToFlex(token: string): string | undefined {
  return MainAlignMap[ token ] || undefined; // undefined if not recognised;
}

/**
 * Format a flex css helper
 * Format: [<direction>]-<crossAlignment>-<mainAlignment>
 */
function formatFlexPosition(key: string, value: string, target: React.CSSProperties) {
  let direction: 'row' | 'column' | undefined; // Assume horizontal
  let mainAlignment: string | undefined;
  let crossAlignment: string | undefined;

  // Tokenize string
  const tokens: string[] = value.split('-').map((token) => token.trim());

  tokens.map((token) => {
    const tokenIsOneOf = (options: string[]) => options.includes(token);
    if (direction == null && tokenIsOneOf([ 'horizontal', 'vertical' ])) {
      direction = token === 'vertical' ? 'column' : 'row'; // tslint:disable-line
      return;
    }

    if (tokenIsOneOf([ 'center', 'start', 'end', 'left', 'right', 'top', 'bottom', 'full', 'baseline' ])) {
      if (crossAlignment == null) {
        if (direction == null && tokenIsOneOf([ 'left', 'right' ])) { direction = 'column'; }
        if (direction == null && tokenIsOneOf([ 'top', 'bottom' ])) { direction = 'row'; }
        crossAlignment = convertCrossAlignToFlex(token);
        return;
      }
      mainAlignment = convertMainAlignToFlex(token);
      return;
    }

    if (tokenIsOneOf([ 'spaceAround', 'spaceBetween' ])) {
      mainAlignment = convertMainAlignToFlex(token);
      return;
    }

  });

  const styles = {
    display: 'flex',
    flexDirection: direction,
    alignItems: crossAlignment,
    justifyContent: mainAlignment,
  };


  mergeAndReplace(key, styles, target);
}



// ----------------------------------------------------------------------------


import { css as glamorCss, StyleAttribute } from 'glamor';
import { Falsy, GlamorValue } from './types';

export const transformStyle = (
  style: React.CSSProperties | GlamorValue | Falsy = {},
): React.CSSProperties | GlamorValue => {
  if (style == null) { return {}; }
  if (style === false) { return {}; }
  if (!R.is(Object, style)) { return style; }
  Object.keys(style).forEach((key) => {
    const value = style[ key ];
    if (value === false || R.isNil(value)) {
      delete style[ key ];
    } else if (valueUtil.isPlainObject(value)) {
      // NB: This is not using formatCss, as we only want the transform, we don't want to convert it to a glamor value.
      style[ key ] = transformStyle(value); // <== RECURSION.
    } else {
      switch (key) {
        case 'Image': formatImage(key, value, style); break;
        case 'Absolute': formatPositionEdges(key, style); break;
        case 'Fixed': formatPositionEdges(key, style); break;
        case 'AbsoluteCenter': formatAbsoluteCenter(key, value, style); break;
        case 'MarginX': formatSpacingPlane('x', 'margin', key, value, style); break;
        case 'MarginY': formatSpacingPlane('y', 'margin', key, value, style); break;
        case 'PaddingX': formatSpacingPlane('x', 'padding', key, value, style); break;
        case 'PaddingY': formatSpacingPlane('y', 'padding', key, value, style); break;
        case 'Flex': formatFlexPosition(key, value, style); break;
        default:
        // Ignore.
      }
    }
  });

  return style;
};


/**
 * Helpers for constructing a CSS object.
 * NB: This doesn't *actually* return React.CSSProperties, but
 */
const formatCss = (...styles: Array<React.CSSProperties | GlamorValue | Falsy>): GlamorValue => {
  const newStyles = styles.map(transformStyle);

  // Finish up.
  return glamorCss(...newStyles) as {};
};


(formatCss as any).image = image;
export const format = formatCss as IFormatCss;
