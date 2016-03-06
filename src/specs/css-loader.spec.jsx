import React from 'react';
import { lorem } from './util';


const IS_BROWSER = typeof(window) !== 'undefined';
if (IS_BROWSER) {
  require('./css-loader.css');
}



const CssSample = () => (
  <div className="css-loader-sample">
    <p>{ lorem(50) }</p>
    <p>{ lorem(50) }</p>
  </div>
);



describe('css-loader', function() {
  this.header(`## Webpack simple CSS loader.`);
  before(() => {
    this
      .component( <CssSample/> );
  });
});
