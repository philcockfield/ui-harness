# ui-harness

[![Build Status](https://travis-ci.org/philcockfield/ui-harness.svg)](https://travis-ci.org/philcockfield/ui-harness)

Isolate, test and document modular UI with React.

http://uiharness.com


## Quick Start

    npm install --save-dev ui-harness

Spin up the UIHarness development server:

```js

require("ui-harness/server").start({
  entry: __dirname + "/specs"
});

```



## Development (of the UIHarness)

    npm install
    npm run specs




## TODO

- .start("./src/specs") => auto detect non-existence of that path, and look for "/lib" version
  This may occur when the module has been published to NPM and "./src" has been ignored.
- toLength(0..1% | 1..100px)
- css.color
      - css.color("white", -0.3..0.3) opacity
      - css.color("white", 1..100) darken-lighten
      - css.white (same as)
- Store skipped suites on console {object} (names only) - ERROR.
- Console.run() - automated run.
- Server methods
