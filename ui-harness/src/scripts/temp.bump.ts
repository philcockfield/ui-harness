import { fs, fsPath } from 'ui-harness.common/lib/server';


export function patch() {
  // Setup initial conditions.
  const path = fsPath.resolve('./package.json');
  const pkg = require(path);

  // Bump version.
  const version = pkg.version as string;
  const parts = version.split('.');
  parts[parts.length - 1] = (parseInt(parts[parts.length - 1], 10) + 1).toString();

  // Write file.
  pkg.version = parts.join('.');
  const json = JSON.stringify(pkg, null, '  ');
  fs.writeFileSync(path, json);
}

patch();
