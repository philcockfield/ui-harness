import { fs, fsPath, constants, Rsync, rsyncExecute } from './common';


export interface IInitOptions {
  force?: boolean;
}
export async function init(options: IInitOptions = {}) {
  const force = options.force === undefined ? false : true;

  // Ensure the `ui-harness` module has been copied out of `node_modules`.
  // NOTE:
  //      This is because `next.js` does not appear to work properly
  //      when being executed from within `node_modules`.
  const BUILD_DIR = fsPath.resolve('./.build');
  const TARGET_DIR = fsPath.resolve('./.build/ui-harness');
  const SOURCE_DIR = fsPath.resolve('./node_modules/ui-harness');
  await fs.ensureDirAsync(BUILD_DIR);

  // Copy the `ui-harness` module.
  if (force || !(await fs.existsAsync(fsPath.join(TARGET_DIR, 'package.json')))) {
    const IGNORE = [
      'src',
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

  // Ensure the .gitignore exists.
  const GIT_IGNORE_FILE = fsPath.join(BUILD_DIR, '.gitignore');
  if (force || !(await fs.existsAsync(GIT_IGNORE_FILE))) {
    const IGNORE = `
      /ui-harness
    `.split('\n').map((line) => line.trim()).join('\n');
    await fs.writeFileAsync(GIT_IGNORE_FILE, IGNORE);
  }
}
