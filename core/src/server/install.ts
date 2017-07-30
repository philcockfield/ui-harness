import { fs, fsPath, constants, Rsync, rsyncExecute, glob } from './common';



export interface IInitOptions {
  force?: boolean;
}
/**
 * Ensure the `ui-harness` module has been copied out of `node_modules`.
 * NOTE:
 *      This is because `next.js` does not appear to work properly
 *      when being executed from within `node_modules`.
 */
export async function copyModule(options: IInitOptions = {}) {
  const force = options.force === undefined ? false : true;

  const BUILD_DIR = constants.BUILD_DIR;
  const TARGET_DIR = fsPath.resolve('./.build/ui-harness');
  const SOURCE_DIR = fsPath.resolve('./node_modules/ui-harness');
  await fs.ensureDirAsync(BUILD_DIR);

  // Copy the `ui-harness` module.
  if (force || !(await fs.existsAsync(fsPath.join(TARGET_DIR, 'package.json')))) {
    const IGNORE = [
      'src',
      'sh',
      'CHANGELOG.md',
      '.npmignore',
      '.gitignore',
      'tsconfig.json',
      'tslint.json',
    ];
    const rsync = new Rsync()
      .source(SOURCE_DIR)
      .destination(BUILD_DIR)
      .exclude(IGNORE)
      .delete()
      .flags('aW');
    await rsyncExecute(rsync);
  }
}



/**
 * Find the spec files from the host module and copy them
 * as a `js` file to be staticly imported.
 */
export async function writeSpecs(pattern: string) {
  // Find files that match glob pattern.
  const paths = (await glob(pattern));

  // Prepare a JS module of `require` statements of the specs
  // to be imported by the [ui-harness/next.js] app.
  const lines = paths
    .map((path) => fsPath.resolve(path))
    .map((path, i) => {
      const moduleVar = `module${i}`;
      const modulePath = `'${path}'`;
      return `
        require(${modulePath});
        util.moduleLoaded(${modulePath});
    `;
    })
    .join('\n');

  const js = `
    const util = require('../state/describe');
    util.incrementUpdateVersion(true);

    ${lines}
  `;

  // Write to file.
  const filePath = fsPath.join(constants.BUILD_DIR, 'ui-harness/lib/generated/specs.generated.js');
  await fs.writeFileAsync(filePath, js);
}

