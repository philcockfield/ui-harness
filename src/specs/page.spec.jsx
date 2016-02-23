import React from 'react';
import { Style } from 'radium';
import { css, PropTypes, lorem } from './util';




describe('Page', function() {
  this.header(`## API for manipulating the containing HTML page.`);
  before(() => {
    this
      .align('top left')
      .load( <FontSample/> );
  });

  section('insertFont', () => {
    const load = (url, fontFamily) => {
      this
        .page.insertFont(`https://fonts.googleapis.com/css?family=${ url }`)
        .load( <FontSample fontFamily={ fontFamily }/> );
    };

    it('`Lato`', () => load('Lato:900,300', 'Lato'));
    it('`Roboto`', () => load('Roboto:900,300', 'Roboto'));
    it('`Josefin Slab`', () => load('Josefin+Slab:300,700', '"Josefin Slab"'));
    it('`Vollkorn`', () => load('Vollkorn:400,700', 'Vollkorn'));
  });

  section('insertScript', () => {
    it('`string:alert`', () => {
      this.page.insertScript('alert("foo")');
    });

    it('`string:console`', () => {
      this.page.insertScript('console.info("Written from inserted script!")');
    });

    it('`object:src`', () => {
      this.page.insertScript({ src: '/sample.js' });
    });
  });
});




/**
 *
 */
class FontSample extends React.Component {
  render() {
    const rules = {
      main: {
        fontFamily: this.props.fontFamily
      },
      h1: {
        fontWeight: 900,
        fontSize: 60,
        marginBottom: 0,
      },
      p: {
        fontWeight: 300,
        marginBottom: 30,
        fontSize: 22,
      },
    };
    return (
      <div className="FontSample">
        <Style rules={ rules } scopeSelector=".FontSample" />
        <main>
          <h1>{ this.props.fontFamily }</h1>
          <p>{ lorem(50) }</p>
          <p>{ lorem(50) }</p>
        </main>
      </div>
    );
  }
}
