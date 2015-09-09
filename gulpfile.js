"use strict"
var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var eslint = require("gulp-eslint");
var babel = require("gulp-babel");
var webpack = require("webpack");
var webpackConfig = require("./src/webpack-config.js");

var SOURCE_PATH = ["./src/**/*.js", "./src/**/*.jsx"];


gulp.task("lint", function() {
  return gulp.src(SOURCE_PATH)
    .pipe(eslint())
    .pipe(eslint.format());
});



// Tanspile the ES6 source to ES5 (lib).
gulp.task("babel:server", function() {
  return gulp.src(["./src/server/**/*"])
    .pipe(babel())
    .pipe(gulp.dest("lib/server"));
});
gulp.task("babel:shared", function() {
  return gulp.src(["./src/shared/**/*"])
    .pipe(babel())
    .pipe(gulp.dest("lib/shared"));
});
gulp.task("babel", ["babel:server", "babel:shared"]);


// ----------------------------------------------------------------------------

function bundle(config, callback) {
  return webpack(config, function(err, stats) {
      if(err) throw new gulpUtil.PluginError("webpack", err);
      gulpUtil.log("[webpack]", stats.toString({}));
  });
};
gulp.task("webpack", function() {
  // bundle(webpackConfig.browser());


  console.log("webpackConfig.devServer() \n\n", webpackConfig.devServer());
  console.log("");
  console.log("-------------------------------------------");
  console.log("");

  console.log("webpackConfig.browser() \n\n", webpackConfig.browser());
  console.log("");
  console.log("-------------------------------------------");
  console.log("");

  console.log("webpackConfig.server() \n\n", webpackConfig.server());
  console.log("");
  console.log("-------------------------------------------");
  console.log("");

  // bundle(webpackConfig.server());
  bundle(webpackConfig.server());


});

// ----------------------------------------------------------------------------


gulp.task("build", ["babel"]);
gulp.task("watch", function(callback) { gulp.watch("./src/**/*", ["build"]) });
gulp.task("prepublish", ["build"]);


gulp.task("default", ["build", "watch"]);
