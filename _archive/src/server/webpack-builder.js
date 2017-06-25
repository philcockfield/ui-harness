import R from 'ramda';
import Promise from 'bluebird';
import fsPath from 'path';
import webpack from 'webpack';
import MemoryFileSystem from 'memory-fs';
import filesize from 'filesize';
import AdmZip from 'adm-zip';


const toSizeStats = (text) => ({
  bytes: text.length,
  display: filesize(text.length),
});


const getInfo = (fsMemory, file) => {
  // Read the generated javascript.
  const js = fsMemory.readFileSync(file);

  // Calculate the size of the JS when zipped.
  const zip = new AdmZip();
  zip.addFile('file.js', new Buffer(js));

  // Prepare stats.
  return {
    file,
    js,
    size: toSizeStats(js),
    zipped: toSizeStats(zip.toBuffer().toString('utf8')),
  };
};



/**
 * Builds the given Webpack configuration to memory.
 * @param {Object} config: The Webpack configuration object.
 * @return {Promise}.
 */
export default (config) => new Promise((resolve, reject) => {
  // Prepare the webpack compiler.
  config = R.clone(config);
  const compiler = webpack(config);
  const fsMemory = compiler.outputFileSystem = new MemoryFileSystem();

  // Compile the JS.
  compiler.run((err, stats) => {
    if (err) {
      reject(err); // Failed.
    } else {

      // Get info about each code chunk.
      const app = getInfo(
        fsMemory,
        fsPath.join(config.output.path, config.output.filename),
      );
      const vendor = getInfo(
        fsMemory,
        '/vendor.js'
      );

      // Finish up.
      const msecs = (stats.endTime - stats.startTime);
      resolve({
        buildTime: {
          msecs,
          secs: +(msecs / 1000).toFixed(1),
        },
        modules: { app, vendor },
      });
    }
  });
});
