/* global document */
import React from 'react';
import Server from 'server-methods/client';



Server.call('foo', 1, 2)
.then(result => {
    console.log('BEFORE result of "foo":', result);
});


// TEMP
Server.onReady(() => {
    Server.call('foo', 1, 2)
      .then(result => {
          console.log('result of "foo":', result);
      })
      .catch((err) => {
        console.log('||err', err);
      });
});


// TEMP
import Shell from './Shell';
React.render(React.createElement(Shell), document.body);
