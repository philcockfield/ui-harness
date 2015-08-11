"use strict"

/*
  Experimental:level-1
  Allows for @decorators
  See: http://babeljs.io/docs/usage/experimental/
  For example, used by @Radium (CSS).

  See also the babel-loader settings within [webpack.config.js]
*/
require("babel/register")({ stage: 1 });
