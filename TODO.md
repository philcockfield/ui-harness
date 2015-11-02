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
- test whether port is being used before starting
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
