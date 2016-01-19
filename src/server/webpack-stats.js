import Promise from "bluebird";
import webpack from "webpack";
import MemoryFileSystem from "memory-fs";
import moment from "moment";
import filesize from "filesize";
import AdmZip from "adm-zip";


const toSizeStats = (text) => {
      return {
        bytes: text.length,
        display: filesize(text.length)
      };
    };


/**
 * Builds the given Webpack configuration to a file.
 *
 * @param {Object} config: The Webpack configuration object.
 * @param {Object} options:
 *                    - production: Flag indicating if the build should be as production.
 *
 * @return {Promise}.
 */
export default (config, options = {}) => {
  return new Promise((resolve, reject) => {
    // Setup initial conditions.
    const IS_PRODUCTION = options.production || false;
    const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
    if (IS_PRODUCTION) { process.env.NODE_ENV = "production"; }

    // Prepare the webpack compiler.
    const compiler = webpack(config);
    const fs = compiler.outputFileSystem = new MemoryFileSystem();

    compiler.run((err, stats) => {
        // Reset the NODE_ENV.
        process.env.NODE_ENV = ORIGINAL_NODE_ENV;

        if (err) {
          reject(err); // Failed.
        } else {

          // Read out the generated javascript.
          const js = fs.readFileSync("/bundle.js");

          // Calculate the size of the JS when zipped.
          const zip = new AdmZip();
          zip.addFile("bundle.js", new Buffer(js));

          // Prepare response.
          const msecs = (stats.endTime - stats.startTime);
          resolve({
            size: toSizeStats(js),
            zipped: toSizeStats(zip.toBuffer().toString("utf8")),
            buildTime: {
              msecs,
              secs: +(msecs / 1000).toFixed(1)
            }
          });

        }
    });
  });
};
