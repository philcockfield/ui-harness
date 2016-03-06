import React from 'react';
import { lorem } from './util';



const CssSample = () => (
  <div className="css-module-sample">
    <p>{ lorem(50) }</p>
    <p>{ lorem(50) }</p>
  </div>
);




describe('css-module', function() {
  this.header(`## Webpack CSS modules.`);
  before(() => {
    this
      .component( <CssSample/> );
  });
});
