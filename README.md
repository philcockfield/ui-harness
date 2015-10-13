# ui-harness

[![Build Status](https://travis-ci.org/philcockfield/ui-harness.svg)](https://travis-ci.org/philcockfield/ui-harness)

Isolate, test and document modular UI with React using standard "describe/it" testing semantics.  

http://uiharness.com

![ScreenShot](https://cloud.githubusercontent.com/assets/185555/10448258/0471dece-71e8-11e5-983a-028dd7df7a1a.png)


## Quick Start

    npm install --save-dev ui-harness

Spin up the UIHarness development server:

```js

require("ui-harness/server").start({
  entry: "./specs"
});

```





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
