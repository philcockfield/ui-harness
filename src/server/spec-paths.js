import R from "ramda";
import fs from "fs-extra";
import fsPath from "path";
import log from "./log";
import bdd from "../shared/bdd";
import chalk from "chalk";


const formatEntryPaths = (entry) => {
    entry = entry || [];
    if (!R.is(Array, entry)) { entry = [entry]; }
    if (entry.length === 0) {
      entry.push("./specs");
      entry.push("./src/specs");
    }
    return entry
        // Ensure there is a specific index.js entry file if only a folder was given.
        // NB: Not having a specific entry file can cause build-errors in WebPack.
        .map(path => path.endsWith(".js") ? path : `${ path }/index.js`)

        // Escape white-spaces within paths.
        .map(path => path.replace(/ /, "\ "))

        // Resolve relative (.) paths into fully-qualified paths.
        .map(path => path.startsWith(".") ? fsPath.resolve(path) : path)

        // Remove any paths that don't actually exist.
        .filter(path => fs.existsSync(path));
  };



const parseSpecs = (paths) => {
    require("babel-register"); // Ensure ES6+ within specs can be imported.
    bdd.register();
    paths.forEach(path => require(path));
    bdd.unregister();
  };




/**
 * Prepare entry paths for the WebPack bundle.
 *
 * @param {String|Array} entry: Paths to entry points of files to pass
 *                              to WebPack to build for the client.
 *
 * @return {Object} of paths.
 */
export default (entry) => {
  const paths = formatEntryPaths(entry);

  // Parse the specs.
  parseSpecs(paths)

  // Check for non-standard characters within the paths.
  paths.forEach(path => {
          if (!path.match(/^[a-z0-9\.\-\_\s\/]+$/i)) {
            console.warn(chalk.red("WARNING Path contains non-standard characters. Hot-reloading may not work."));
            console.warn(chalk.red("        Hint: Brackets '(...)' will cause problems."));
            console.log(chalk.cyan(`        ${ path }`));
            console.log("");
          }
        });

  // Finish up.
  return paths;
};
