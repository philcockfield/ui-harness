"use strict"
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var babel = require("gulp-babel");
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


gulp.task("build", ["babel"]);
gulp.task("watch", function(callback) { gulp.watch("./src/**/*", ["build"]) });
gulp.task("prepublish", ["build"]);


gulp.task("default", ["build", "watch"]);
