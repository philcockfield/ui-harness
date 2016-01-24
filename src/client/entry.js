/**
 * Main entry point for the UIHarness in the browser.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import api from '../shared/api-internal';
import bdd from '../shared/bdd';
import Shell from '../components/Shell';


// Ensure the 'describe/it' statements are in the global namespace.
bdd.register();


// Render the <Shell> into the DOM.
const render = () => {
  api.shell = ReactDOM.render(
    React.createElement(Shell, { current: api.current }),
    document.getElementById('page-root')
  );
};


// Initialize the UIHarness.
const init = () => api.init().then(render);


// Wait for all scripts to load before initializing.
window.addEventListener('load', init);
