import R from 'ramda';
import Promise from 'bluebird';
import webpack from 'webpack';
import MemoryFileSystem from 'memory-fs';
import filesize from 'filesize';
import AdmZip from 'adm-zip';


const toSizeStats = (text) => ({
  bytes: text.length,
  display: filesize(text.length),
});




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
      // Read the generated javascript.
      const js = fsMemory.readFileSync('/bundle.js');

      // Calculate the size of the JS when zipped.
      const zip = new AdmZip();
      zip.addFile('bundle.js', new Buffer(js));

      // Prepare response.
      const msecs = (stats.endTime - stats.startTime);
      resolve({
        js,
        size: toSizeStats(js),
        zipped: toSizeStats(zip.toBuffer().toString('utf8')),
        buildTime: {
          msecs,
          secs: +(msecs / 1000).toFixed(1),
        },
      });
    }
  });
});
