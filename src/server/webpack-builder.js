import R from "ramda";
import fs from "fs-extra";
import fsPath from "path";
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
 * Builds the given Webpack configuration to memory.
 *
 * @param {Object} config: The Webpack configuration object.
 * @param {Object} options:
 *                    - save: Path to save the JS output to.
 *
 * @return {Promise}.
 */
export default (config, options = {}) => {
  return new Promise((resolve, reject) => {

    // Prepare the webpack compiler.
    config = R.clone(config);
    const compiler = webpack(config);
    const fsMemory = compiler.outputFileSystem = new MemoryFileSystem();

    // Compile the JS.
    compiler.run((err, stats) => {
          if (err) {
            reject(err); // Failed.
          } else {

            // Read the generated javascript.
            const js = fsMemory.readFileSync("/bundle.js");

            // Save to a file if requested.
            if (R.is(String, options.save)) {
              fs.outputFileSync(options.save, js);
            }

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
