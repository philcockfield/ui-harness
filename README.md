# ui-harness
[![Build Status](https://travis-ci.org/philcockfield/ui-harness.svg)](https://travis-ci.org/philcockfield/ui-harness)

Isolate, test and document modular UI with React using familiar `describe/it` testing semantics.  

http://uiharness.com

![ScreenShot](https://cloud.githubusercontent.com/assets/185555/10448258/0471dece-71e8-11e5-983a-028dd7df7a1a.png)


## Quick Start (1-minute)
With the UIHarness you can go from an empty NPM module, to cleanly building isolated React components using best-practices in well under a minute.

See the quick-start sample repo https://github.com/philcockfield/ui-harness-sample

    git clone https://github.com/philcockfield/ui-harness-sample.git
    npm install
    npm start






## Manual Setup
The UIHarness is just a simple NPM module.  Simply add it to you `package.json` file:

```json
{
  "name": "my-components",
  "version": "1.0.0",
  "scripts": {
    "start": "node ./node_modules/ui-harness/start --entry=./src/specs",
  },
  "devDependencies": {
    "ui-harness": "^3.1.0"
  },
  "engines": { "node": ">=5.5.0" }
}
```

From here you can start developing your React components.  All the core dependencies for `react` and `babel` transpiling are made available to your module by virtue of the one `ui-harness` dependency.

Now simply run:

    npm start

And navigate your browser to `http://localhost:3030`

#### Project Structure
The `package.json` above assumes a project structure like this:

    my-components
    |— src
      |— components       # React components here.
      |— specs            # Spec files here.
         |— index.js      # --entry to the "describe/it" visual specification files.

For a working sample see: https://github.com/philcockfield/ui-harness-sample

------


## Conceptual Introduction
The UIHarness allows you to add a one-line startup script to your node module that provides a complete visual test and build harness for creating and bundling your components.

#### Creating
As a tool for crafting your components and their API's in isolation, the UIHarness dramatically improves the quality and reuse potential of your UI investment.  You will be falling into the "pit of success" conforming to best-practices that also make your job faster and easier.

#### Documentation
Creating components in this manner has the knock-on effect of providing a visual API and documentation explorer for your component system.  Sharing and socializing code and API's, both within your team, and publicly to the world, is a big part of making software a success.  Functional documentation is a by-product of building components in the UIHarness.

#### Publishing
If you are isolating your UI components into their own module (a very good idea), you can add the UIHarness, create and test your components with it, and then publish your module to NPM with the UIHarness as the startup option (`npm start`).  

This makes your components easy to explore, evaluate, and understand by developers.  This adds no run-time overhead, as consumers of the components will only be requiring the isolated component, not the UIHarness itself, so it never gets built (via [Webpack](https://webpack.github.io/)) into the resulting application bundle.



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

To rebuild the schema (when changes have been made to it), simply delete the `schema.json` file and restart the UIHarness.


# Links
- [Landing Page](http://uiharness.com)
- [Documentation](https://philcockfield.gitbooks.io/ui-harness/content/index.html) ([edit](https://www.gitbook.com/book/philcockfield/ui-harness/edit))



---
### License: MIT
