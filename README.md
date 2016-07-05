# ui-harness
[![Build Status](https://travis-ci.org/philcockfield/ui-harness.svg?branch=master)](https://travis-ci.org/philcockfield/ui-harness)
[![npm version](https://badge.fury.io/js/ui-harness.svg)](https://badge.fury.io/js/ui-harness)
[![js-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat)](https://github.com/airbnb/javascript)

Isolate, test and document modular UI with React using familiar `describe/it` testing semantics.  

http://uiharness.com

![ScreenShot](https://cloud.githubusercontent.com/assets/185555/10448258/0471dece-71e8-11e5-983a-028dd7df7a1a.png)




## Quick Start (1-minute)
With the UIHarness you can go from an empty NPM module, to cleanly building isolated React components using best-practices in well under a minute.

See the quick-start sample repo https://github.com/philcockfield/ui-harness-sample

    git clone https://github.com/philcockfield/ui-harness-sample.git
    cd ui-harness-sample
    npm install
    npm start




## Manual Setup
The UIHarness is just a simple NPM module.  

    npm install --save-dev ui-harness

Simply add it to you `package.json` file, with a `start` script:

```json
{
  "name": "my-components",
  "version": "1.0.0",
  "scripts": {
    "uih": "node ./node_modules/ui-harness/start --entry=./src/specs",
  },
  "devDependencies": {
    "ui-harness": "^3.3.0"
  },
  "engines": { "node": ">=5.5.0" }
}
```

If you are using TypeScript, you will also need to ensure you have type definitions for your dependencies, such as React and React-DOM.

From here you can start developing your React components.  All the core dependencies for `react` and `babel` transpiling are made available to your module by virtue of the one `ui-harness` dependency.

Now simply run:

    npm run uih

And navigate your browser to `http://localhost:3030`

#### Project Structure
The `package.json` above assumes a project structure like this:

    my-components
    |— src
      |— components       # React components here.
      |— specs            # Spec files here.
         |— index.js      # --entry to the "describe/it" visual spec files.

For a working example see the [ui-harness-sample](https://github.com/philcockfield/ui-harness-sample) repo. To deviate from this typical structure simply organize your module folders as you wish and change the `--entry` path passed to the start script.

------


## Conceptual Introduction
The [UIHarness](http://uiharness.com) allows you to add a one-line startup script to your node module that provides a complete visual test and build harness for creating and bundling your components.

#### Creating
As a tool for crafting your components and their API's in isolation, the UIHarness dramatically improves the quality and reuse potential of your UI investment.  You will be falling into the "pit of success" conforming to best-practices that also make your job faster and easier, and importantly - **more fun**.

#### Documentation
Creating components in this manner has the knock-on effect of providing a visual API and documentation explorer for your component system.  Sharing and socializing code and API's, both within your team, and publicly to the world, is a big part of making software a success.  Functional documentation is a by-product of building components in the UIHarness.

#### Publishing
If you are isolating your UI components into their own discreet modules (a very good idea!), you can add the UIHarness as a dev-dependency (`--save-dev`), create and test your components within it, and then [publish](https://docs.npmjs.com/cli/publish) your module to NPM with the UIHarness as the startup option (`npm start`).  

This makes your components easy to explore, evaluate, and understand by other developers.  The UIHarness adds no run-time overhead to your module, as consumers of the components will only be requiring the isolated component, not the UIHarness itself, so it never gets built (via [Webpack](https://webpack.github.io/)) into the resulting application bundle.


## Startup Arguments and Configuration
The following arguments can be passed to the UIHarness at startup as command-line arguments:

- `--entry` Path to the specs files (comma separated if more than one).

- `--port` The port to run the harness on.  Default: `3030`

For example:

```json
"scripts": {
  "start": "node ./node_modules/ui-harness/start --entry=./src/specs --port=1234"
}
```


#### .uiharness.yml
These values can alternatively be declared in a `.uiharness.yml` configuration file in the root of your project, with the following additional values that can only be declared within a YAML configuration:

- `graphqlSchema`
A path to the [GraphQL](https://facebook.github.io/graphql/) `schema.js` file. If not specified [Relay](https://facebook.github.io/relay/) will not be enabled.

- `proxy` An object containing `{ path, host }` mappings to proxy server requests to ([reference](https://webpack.github.io/docs/webpack-dev-server.html#proxy)).

- `images` An object containing `{ baseUrl, dir }` that declares where images are served from.  Default image values are:
  - `baseUrl: <package-name>`
  - `dir: ./images`


```yml
entry: ./src/specs  # Path, comma-separated paths, or array of paths.
port: 3030
graphqlSchema: ./data/schema.js
proxy:
  /graphql: http://localhost:8080
images:
  baseUrl: /my-images
  dir: ./assets/images
```


### CSS
By default the UIHarness supports the webpack [css-loader] for `*.css` files.  If however you wish to use [css-modules] simply declare the file extension of your modules in the `.uiharness.yml` with a regular-expression like this:

```yaml
cssModules: .css
```

If you wish to retain the default [css-loader] behavior but still want to use [css-modules], you can specify [css-modules] to only work on certain extensions:

```yaml
cssModules: .module.css
```

And if you wish to use several different extensions for [css-modules] you can specify a list:

```yaml
cssModules:
  - .css
  - .module.css
```

[css-loader]: https://github.com/webpack/css-loader
[css-modules]: https://github.com/css-modules/css-modules

## Building
You can use the UIHarness to output your built JS bundles.  You can also use this function to keep an eye on the size of your JS before it's too late to do anything about it.

Declare a `build` section within the `.uiharness.yml` with the following fields:

```yaml
build:
  prod: true  # Minifies if true (default: false).
  outputFolder: ./.build/my-folder

  modules:
    main: ./src/app.js
    single:
      - ./src/components/foo.jsx
      - ./src/util/bar.js

  vendor:
    - react
    - react-dom

```

##### Command Line
The build function can be invoked from the command line.  For example, you might add these as scripts to your `package.json`:

```json
  "scripts": {
    "bundle": "node ./node_modules/ui-harness/build",
  }
```

Producing the following output in the terminal window:

![Terminal:Size](https://cloud.githubusercontent.com/assets/185555/12995230/c974f83a-d18a-11e5-914c-48589704df78.png)


##### Building from the API
You can invoke a build via the API by passing an object of the same structure as the `build` settings within `.uiharness.yml` to the build function:

```js
import uiharness from 'ui-harness';

uiharness.build({ settings }) // See YAML build settings above.
  .then(result => { ... })
  .catch(err => { ... });

```


## Environment
When running the `__UIHARNESS__` environment variable is set to `true`.  Use this as a switch if you wish to consolidate UIHarness specs with unit-tests such as Mocha or Jasmine, or BDD feature/step files.

```js
if (__UIHARNESS__) {
  describe('My visual spec', function() {
    // This will load in the UIHarness
  });
}

if (!__UIHARNESS__) {
  describe('My unit-tests', function() {
    // This will run within the server-side test runner.
  });
}
```



## Examples
#### Simple Example
From within the `/ui-harness` project folder, to see the core set of specs used to build the UIHarness itself, along with specs for associated component libraries, run:

    npm start

#### Relay Example

To see an example of Relay/GraphQL working within UIHarness run:

    node example relay

Based on the [relay-starter-kit](https://github.com/relayjs/relay-starter-kit), this takes a command-line argument of `--graphqlSchema`, which is the path to the GraphQL `schema.js` file.

```js
uiharness.start({
  entry: './example/relay/specs',
  proxy: { '/graphql': 'http://localhost:8080' },
  graphqlSchema: path.resolve('./example/relay/data/schema.js')
})
```

From there the UIHarness will build the `schema.json` output, and compile it into the Webpack output sent to the client using the [babel-relay-plugin](https://www.npmjs.com/package/babel-relay-plugin).

To rebuild the schema (when changes have been made to it), simply delete the generated `schema.json` file and restart the UIHarness.


# Links
- [uiharness.com](http://uiharness.com)
- [Documentation](https://philcockfield.gitbooks.io/ui-harness/content/index.html) ([edit](https://www.gitbook.com/book/philcockfield/ui-harness/edit))



---
### License: MIT
