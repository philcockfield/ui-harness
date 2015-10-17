import fs from "fs-extra";
import fsPath from "path";
const MODULE_PATH = fsPath.join(__dirname, "../../..");


export const copyTemplates = (rootPath = "./src") => {
    // Ensure the path is at the root.
    rootPath = rootPath.replace(/^\./, "").replace(/^\//, "");
    rootPath = fsPath.resolve(`./${ rootPath }`);

    // Copy template files.
    const copy = (source, target) => {
        source = `${ MODULE_PATH }/templates/quick-start/${ source }`;
        target = `${ rootPath }/${ target }`;
        fs.copySync(source, target);
      };
    copy("components/MyComponent.jsx", "components/MyComponent.jsx");
    copy("specs/index.js", "specs/index.js");
    copy("specs/MyComponent.spec.jsx", "specs/MyComponent.spec.jsx");

    // Ensure `react` module exists in host module.
    const ensureModule = (name) => {
        if (!fs.existsSync(`./node_modules/${ name }`)) {
          fs.copySync(fsPath.join(MODULE_PATH, `node_modules/${ name }`), `./node_modules/${ name }`);
        }
      };
    ensureModule("react");
    ensureModule("react-dom");


    // Finish up.
    return { success: true };
  };






export default (service) => {
  service.methods({
    quickStart: {
      docs: `
        Initializes the module with a quick-start sample.
        @param {string} rootPath: Path within the host module of
                                  the folder to copy templates into.
      `,
      put(rootPath) {
        // Copy the files.
        const result = copyTemplates(rootPath);

        // Restart the server.
        // NB: Required here to prevent load-order circular reference.
        const middleware = require("../middleware");
        return new Promise((resolve, reject) => {
          middleware.restart()
            .then(() => resolve(result))
            .catch(err => reject(err));
        });
      }
    }
  });
};
