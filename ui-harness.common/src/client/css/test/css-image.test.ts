import { expect } from 'chai';
import { transformStyle } from '../css';
import { css } from '..';
import { MEDIA_QUERY_RETINA } from '../css';
const browserWindow: any = global;
const { image } = css;


describe('React: CSS - image', () => {
  describe('image()', () => {
    afterEach(() => {
      delete browserWindow.devicePixelRatio;
    });

    it('is attached to the [css] function as a property', () => {
      expect(css.image).to.equal(image);
    });

    it('throws if an image was not specified', () => {
      expect(() => { image(undefined, undefined); }).to.throw();
    });

    it('returns the 1x resolution', () => {
      browserWindow.devicePixelRatio = 1;
      const result = image('1x', '2x');
      expect(result.backgroundImage).to.equal('url(1x)');
    });

    it('returns the 2x resolution', () => {
      browserWindow.devicePixelRatio = 2;
      const result = image('1x.png', '2x.png');
      expect(result.backgroundImage).to.equal('url(1x.png)');
      expect(result[MEDIA_QUERY_RETINA].backgroundImage).to.equal('url(2x.png)');

    });

    it('returns the 1x resolution on hi-res screen when no 2x image (undefined)', () => {
      browserWindow.devicePixelRatio = 2;
      expect(image('1x', undefined, { width: 10, height: 20 }).backgroundImage).to.equal('url(1x)');
    });

    it('has width and height values (defaults)', () => {
      const result = image('1x', '2x');
      expect(result.width).to.equal(10);
      expect(result.height).to.equal(10);
    });

    it('has width and height values (specified)', () => {
      const result = image('1x', '2x', { width: 20, height: 150 });
      expect(result.width).to.equal(20);
      expect(result.height).to.equal(150);
    });

    it('has [backgroundSize]', () => {
      const result = image('1x', '2x', { width: 20, height: 150 });
      expect(result.backgroundSize).to.equal('20px 150px');
    });

    it('does not repeat the background', () => {
      const result = image('1x', '2x', { width: 20, height: 150 });
      expect(result.backgroundRepeat).to.equal('no-repeat');
    });
  });

  describe('Image replacement via css() method', () => {
    it('replaces `Image` with style settings (1x)', () => {
      browserWindow.devicePixelRatio = 1;
      const style = transformStyle({ Image: ['1x', '2x', 20, 30] }) as any;
      expect(style.Image).to.equal(undefined);
      expect(style.backgroundImage).to.equal('url(1x)');
      expect(style.width).to.equal(20);
      expect(style.height).to.equal(30);
      expect(style.backgroundSize).to.equal('20px 30px');
      expect(style.backgroundRepeat).to.equal('no-repeat');
    });

    it('replaces `Image` with style settings (2x)', () => {
      browserWindow.devicePixelRatio = 2;
      const style = transformStyle({ Image: ['1x.JPG', '2x.JPG', 20, 30] }) as any;
      expect(style.Image).to.equal(undefined);
      expect(style.backgroundImage).to.equal('url(1x.JPG)');
      expect(style[MEDIA_QUERY_RETINA].backgroundImage).to.equal('url(2x.JPG)');
    });

  });
});
