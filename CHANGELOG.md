# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased] - YYYY-MM-DD
#### Added
- Calculating size and zipped size of JS bundle at startup.
- Bundling the UIHarness code itself as a static file so only the test specs/components are build (faster).
- `npm run bundle` command.

#### Changed
- Moved from WebPack middleware to use the WebpackDevServer.
  - This was done because reload issues were occurring with the middleware (it is less well supported) and is no longer necessary with an firmer understanding of the `proxy` feature of the WebpackDevServer which allows for a server-app to be used.


#### Deprecated
#### Removed
#### Fixed
#### Security



## [2.0.0] - 2016-01-04
#### Changed
- Updated to using Babel 6.



## [1.1.9] - 2015-12-4
#### Fixed
- Fixed breaking changes caused by updates to `react-schema` module.



## [0.0.1] - YYYY-MM-DD
#### Added
Initial creation and publish.
