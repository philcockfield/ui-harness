import React from 'react';
import { lorem } from './util';


const IS_BROWSER = typeof(window) !== 'undefined';
if (IS_BROWSER) {
  require('./css-loader.css');
}



class CssSample extends React.Component {
  render() {
    return (
      <div className="css-sample">
        <p>{ lorem(50) }</p>
        <p>{ lorem(50) }</p>
      </div>
    );
  }
}



describe('CSS', function() {
  this.header(`## CSS via webpack css-loader.`);
  before(() => {
    this
      .component( <CssSample/> );
  });
});
