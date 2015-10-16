# ui-harness

[![Build Status](https://travis-ci.org/philcockfield/ui-harness.svg)](https://travis-ci.org/philcockfield/ui-harness)

Isolate, test and document modular UI with React using familiar "describe/it" testing semantics.  

http://uiharness.com

![ScreenShot](https://cloud.githubusercontent.com/assets/185555/10448258/0471dece-71e8-11e5-983a-028dd7df7a1a.png)


## Quick Start (1-minute)
With the UIHarness you can go from an empty NPM module, to cleanly building isolated React components using best-practices in well under a minute.

Start a new module with the UIHarness pre-installed by running:

```bash
$ curl -L http://j.mp/ui-harness | sh
```

Then open the browser to [localhost:3030](http://localhost:3030/) and the UIHarness will guide you from there.


## Manual Install
The UIHarness is just a simple NPM module.  To add it to an existing module install it like normal:

    npm install ui-harness

Then within your entry file start the server:
```js
// index.js
require("ui-harness/server").start({ babel: 1 });
```


------


## Conceptual Introduction
The UIHarness allows you to add a one-line startup script to your node module that provides a complete visual test and build harness for creating your components.

#### Creating
As a tool for crafting your components and their API's in isolation, the UIHarness dramatically improves the quality and reuse potential of your UI investment.  You will be falling into the "pit of success" conforming to best-practices that also make your job faster and easier.

#### Documentation
Creating components in this manner has the knock-on effect of providing a visual API and documentation explorer for your component system.  Sharing and socializing code and API's, both within your team, and publicly to the world, is a big part of making software a success.  Functional documentation is a by-product of building components in the UIHarness.

#### Publishing
If you are isolating your UI components into their own module (a very good idea), you can add the UIHarness, create and test your components with it, and then publish your module to NPM with the UIHarness as the startup option (`npm start`).  

This makes your components easy to explore, evaluate, and understand by developers.  This adds no run-time overhead, as consumers of the components will only be requiring the isolated component, not the UIHarness itself, so it never gets built (via [Webpack](https://webpack.github.io/)) into the resulting application bundle.


---
### License: MIT



---
## TODO

- PropTypes as static property (see example: https://github.com/FormidableLabs/radium/tree/master/docs/api)

      class MyComponent extends React.Component {
        static printStyles = {
          wrapper: { background: 'black' },
          text: { color: 'red' }
        };

- source-maps.
- hide "API" in index column if there is no propsTypes.
- default create the "/specs" folder from start() method.
- color prop on sample <MyComponent>.
- this.footer(`For quick-start documentation`).
-----

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
