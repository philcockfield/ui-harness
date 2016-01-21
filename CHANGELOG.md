# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [3.0.0] - 2016-01-21
#### Added
- Bundling the UIHarness code itself as a static file so only the test specs/components are build (faster).
- `node bundle` command.

#### Changed
- Moved from WebPack middleware to use the `WebpackDevServer`.
  - This was done because reload issues were occurring with the middleware (it is less well supported) and is no longer necessary with an firmer understanding of the `proxy` feature of the WebpackDevServer which allows for a server-app to be used.




## [2.0.0] - 2016-01-04
#### Changed
- Updated to using Babel 6.



## [1.1.9] - 2015-12-04
#### Fixed
- Fixed breaking changes caused by updates to `react-schema` module.
