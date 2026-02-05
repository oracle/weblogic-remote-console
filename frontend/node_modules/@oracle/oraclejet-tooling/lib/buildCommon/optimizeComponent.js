/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const util = require('../util');
const hookRunner = require('../hookRunner');
const pathGenerator = require('../rjsConfigGenerator');
const fs = require('fs-extra');
const CONSTANTS = require('../constants');
const path = require('path');
const glob = require('glob');

/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.rjsOptions
 * @param {string} options.root component root,
 * if singleton its = componentName and if pack component its =
 * packName
 * @param {string[]} options.extraExcludes
 * @param {string[]} options.extraEmpties
 * @returns {Promise<object>}
 */
function optimizeComponent({
  context,
  rjsOptions,
  root,
  extraExcludes,
  extraEmpties,
  tempBundleFile
}) {
  util.log(`Running component requirejs task for ${rjsOptions.name}`);
  return util.runPromisesInSeries([
    () => optimizeComponentSetup({
      context,
      rjsOptions,
      root,
      extraExcludes,
      extraEmpties,
      tempBundleFile
    }),
    () => ojcssPatchBeforeOptimize({ context, root }),
    () => hookRunner('before_component_optimize', context),
    () => optimizeComponentInvoker({ context, rjsOptions, tempBundleFile }),
    () => ojcssPatchAfterOptimize({ context, root })
  ]);
}


/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.rjsOptions
 * @param {string} options.root component root,
 * if singleton its = componentName and if pack component its =
 * packName
 * @param {string[]} options.extraExcludes
 * @param {string[]} options.extraEmpties
 * @returns {Promise<object>}
 */
function optimizeComponentSetup({
  context,
  rjsOptions,
  root,
  extraExcludes,
  extraEmpties
}) {
  try {
    const pathMappings = pathGenerator.getMasterPathsMapping(context, true);
    const rConfig = {
      ...rjsOptions,
      optimize: context.opts.requireJsComponent.optimize,
      buildCSS: context.opts.requireJsComponent.buildCSS,
      separateCSS: context.opts.requireJsComponent.separateCSS,
      generateSourceMaps: context.opts.requireJsComponent.generateSourceMaps
    };
    const exclude = ['css', 'ojcss', 'ojs/ojcss', 'ojL10n', 'text', 'normalize', 'ojs/normalize', 'css-builder'];
    if (extraExcludes) {
      extraExcludes.forEach((extraExclude) => {
        pathMappings[extraExclude] = 'empty:';
        exclude.push(extraExclude);
      });
    }
    Object.keys(pathMappings).forEach((lib) => {
      if (!exclude.includes(lib)) {
        pathMappings[lib] = 'empty:';
      }
    });
    if (extraEmpties) {
      extraEmpties.forEach((extraEmpty) => {
        pathMappings[extraEmpty] = 'empty:';
      });
    }
    rConfig.paths = pathMappings;
    rConfig.exclude = exclude;
    if (root) {
      rConfig.paths[root] = '.';
    }
    // eslint-disable-next-line no-param-reassign
    context.opts.componentRequireJs = rConfig;
    return Promise.resolve(context);
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.rjsOptions
 * @returns {Promise<object>}
 */
function optimizeComponentInvoker({ context, rjsOptions, tempBundleFile }) {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line global-require, import/newline-after-import, import/no-dynamic-require
      const requirejs = require('./../rjs/r.js');

      if (fs.existsSync(path.join(context.opts.componentRequireJs.baseUrl, 'component.json'))) {
        const monoPackJson = fs.readJSONSync(path.join(context.opts.componentRequireJs.baseUrl, 'component.json'));
        if (monoPackJson.type === CONSTANTS.PACK_TYPE.MONO_PACK && monoPackJson.dependencies) {
          const componentCache = util.getComponentsCache();
          Object.getOwnPropertyNames(monoPackJson.dependencies).forEach((dependency) => {
            const componentJson = componentCache && componentCache[dependency] ?
              componentCache[dependency].componentJson : undefined;
            if (componentJson && componentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE) {
              // eslint-disable-next-line max-len
              const packageName = componentJson.package ? componentJson.package : componentJson.name;
              const pathName = (componentJson.paths && componentJson.paths.name) || packageName;
              // eslint-disable-next-line no-param-reassign
              context.opts.componentRequireJs.paths[pathName] = 'empty:';
            } else {
              // eslint-disable-next-line max-len
              const importName = (componentCache[dependency] && componentCache[dependency].importName) || undefined;
              if (!importName) {
                util.log.warning(`The dependency ${dependency} is not available in the project. Skipping its optimization...`);
              } else {
                const pathToBuiltComponent = path.resolve(componentCache[dependency].builtPath);
                // eslint-disable-next-line no-param-reassign
                context.opts.componentRequireJs.paths[importName] = 'empty:';
                // eslint-disable-next-line no-param-reassign
                context.opts.componentRequireJs.paths[`${CONSTANTS.PATH_MAPPING_PREFIX_TOKEN}${importName}`] = pathToBuiltComponent;
              }
            }
          });
        }
      }
      requirejs.optimize(
        context.opts.componentRequireJs,
        () => {
          if (context.opts.optimize === 'none') {
            // remove the temporary stub bundle file once it is no longer needed.
            if (tempBundleFile && fs.existsSync(tempBundleFile)) {
              fs.removeSync(tempBundleFile);
            }
            resolve(context);
          } else {
            // Handle the case where the before_optimize trigger has updated
            // the configuration used by r.js to output a non-standard optimized
            // component file - something other than loader.js
            // (This code should be revisited when main support is added for components)
            const loaderSignature = `${path.sep}loader.js`;
            let minifyFile = rjsOptions.out;
            if (rjsOptions.out.endsWith(loaderSignature) &&
                !context.opts.componentRequireJs.out.endsWith(loaderSignature)) {
              minifyFile = context.opts.componentRequireJs.out;
            }
            // If a special copyTo filename is set, copy the file before terser minifies
            // it up to that location
            if (context.opts.componentRequireJs.copyTo) {
              fs.copyFileSync(minifyFile, context.opts.componentRequireJs.copyTo);
            }
            util.minifyFiles({
              files: [{ dest: minifyFile, src: minifyFile }],
              options: context.opts.terser.options,
              generateSourceMaps: true,
              minify: true
            }).then(() => {
              if (tempBundleFile && fs.existsSync(tempBundleFile) &&
                tempBundleFile !== context.opts.componentRequireJs.copyTo) {
                fs.removeSync(tempBundleFile);
              }
              resolve(context);
            }).catch((minifyError) => {
              util.log.error(minifyError);
            });
          }
        },
        (err) => {
          util.log(err);
          util.log.error(err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Patch the r.js configuration to workaround the lack of support
 * for the empty: scheme when using the ojcss plugin. At a high level,
 * we create a special path mapping for ojcss imports that ensures that
 * they are resolved while the other imports (*.js, *.json etc ) continue to
 * be ignored as expected when empty: is used
 *
 * @param {object} options.root - component root, either the component name if
 * it is a singleton or the pack name if it is in a JET pack
 * @param {object} options.context - build context
 * @returns {Promise<object>} build context
 */
async function ojcssPatchBeforeOptimize({ root, context }) {
  // Only patch the r.js config of none-reference components that will
  // always have root set
  if (root) {
    const configPaths = util.getConfiguredPaths();
    const { componentRequireJs } = context.opts;
    const prefixedPathMappings = Object
      .keys(componentRequireJs.paths)
      .filter(pathMappingKey => pathMappingKey.startsWith(CONSTANTS.PATH_MAPPING_PREFIX_TOKEN));
    // Revert @ path mappings from empty: (set in optimizeComponentSetup). ojcss needs a
    // resolvable path to process CSS files. A path mapping with empty: throws an error
    prefixedPathMappings
      .forEach((prefixedPathMapping) => {
        // Get path mapping without prefix e.g @oj-pack/resources to oj-pack/resources
        const unprefixedPathMapping = prefixedPathMapping
          .substring(CONSTANTS.PATH_MAPPING_PREFIX_TOKEN.length);
        // Split path mapping by path seperator
        const pathMappingParts = path.normalize(unprefixedPathMapping).split(path.sep);
        let componentPath;
        if (pathMappingParts.length === 2) {
          // If split contains two entries and is a component, path mapping
          // corresponds to a pack component.
          const [pack, component] = pathMappingParts;
          componentPath = util.isWebComponent({ pack, component }) ?
            util.generatePathToComponentRoot({
              context,
              pack,
              component,
              root: context.opts.stagingPath,
              scripts: configPaths.src.javascript
            }) :
            null;
        } else if (pathMappingParts.length === 1) {
          // If split contains one entry and is a component, path mapping corresponds
          // to a singleton component.
          const [component] = pathMappingParts;
          componentPath = util.isWebComponent({ component }) ?
            util.generatePathToComponentRoot({
              context,
              component,
              root: context.opts.stagingPath,
              scripts: configPaths.src.javascript
            }) :
            null;
        }
        if (componentPath) {
          componentRequireJs.paths[prefixedPathMapping] = path.resolve(componentPath);
        }
      });
    // Check *.js files in the component folder for ojcss imports
    getJavascriptFilesInComponentFolder({ context })
      .forEach((filePath) => {
        let content = util.readFileSync(filePath);
        prefixedPathMappings
          .forEach((prefixedPathMapping) => {
            // For each prefixed path mapping, determine the unprefixed version and replace
            // that with the prefixed version e.g ojcss!oj-pack/resources/css/shared.css
            // becomes ojcss!$oj-pack/resources/css/shared.css.
            content = content.replace(
              new RegExp(`ojcss!${prefixedPathMapping.substring(CONSTANTS.PATH_MAPPING_PREFIX_TOKEN.length)}`, 'g'),
              `ojcss!${prefixedPathMapping}`
            );
          });
        util.writeFileSync(filePath, content);
      });
  }
  return context;
}


/**
 * Patch the r.js configuration to workaround the lack of support
 * for the empty: scheme when using the ojcss plugin. At a high level,
 * we are reverting the prefixed path mapping injection done in
 * ojcssPatchBeforeOptimize
 *
 * @param {object} options.root - component root, either the component name if
 * it is a singleton or the pack name if it is in a JET pack
 * @param {object} options.context - build context
 * @returns {Promise<object>} build context
 */
async function ojcssPatchAfterOptimize({ root, context }) {
  // Only patch the r.js config of none-reference components that will
  // always have root set
  if (root) {
    const { componentRequireJs } = context.opts;
    const prefixedPathMappings = Object
      .keys(componentRequireJs.paths)
      .filter(pathMappingKey => pathMappingKey.startsWith(CONSTANTS.PATH_MAPPING_PREFIX_TOKEN));
    // Revert ojcss imports in original component file(s)
    // i.e. $oj-pack/resources to oj-pack/resources
    getJavascriptFilesInComponentFolder({ context })
      .forEach((filePath) => {
        let fileContent = util.readFileSync(filePath);
        prefixedPathMappings
          .forEach((prefixedPathMapping) => {
            fileContent = fileContent.replace(
              new RegExp(`ojcss!${prefixedPathMapping}`, 'g'),
              `ojcss!${prefixedPathMapping.substring(CONSTANTS.PATH_MAPPING_PREFIX_TOKEN.length)}`
            );
          });
        util.writeFileSync(filePath, fileContent);
      });
    // Revert ojcss imports in generated loader.js file
    let loaderFileContent = util.readFileSync(componentRequireJs.out);
    prefixedPathMappings
      .forEach((prefixedPathMapping) => {
        loaderFileContent = loaderFileContent.replace(
          new RegExp(`ojcss!${prefixedPathMapping}`, 'g'),
          `ojcss!${prefixedPathMapping.substring(CONSTANTS.PATH_MAPPING_PREFIX_TOKEN.length)}`
        );
      });
    util.writeFileSync(componentRequireJs.out, loaderFileContent);
  }
  return context;
}

/**
 * Get *.js files in component folder, that is where the ojcss imports are
 * @param {object} options.context - build context
 * @returns {string}
 */
function getJavascriptFilesInComponentFolder({ context }) {
  const { componentRequireJs } = context.opts;
  const configPaths = util.getConfiguredPaths();
  let pack;
  let componentFilePattern;
  let component;
  if (util.useUnversionedStructure(context)) {
    // componentRequireJs.baseUrl is of the form web/components/<component>
    // so the code below gets us <component>
    component = path.basename(componentRequireJs.baseUrl);
  } else {
    // componentRequireJs.baseUrl is of the form web/components/<component>/<version>
    // so the code below gets us <component>
    component = path.basename(path.dirname(componentRequireJs.baseUrl));
  }
  if (util.isJETPack({ pack: component })) {
    pack = component;
    // componentRequireJs.name is of the <pack>/<component>/loader.js
    // so the code below gets us <component>
    component = path.basename(path.dirname(componentRequireJs.name));
    componentFilePattern = path.join(
      util.generatePathToComponentRoot({
        context,
        pack,
        component,
        root: context.opts.stagingPath,
        scripts: configPaths.src.javascript
      }),
      '**/*.js'
    );
  } else {
    componentFilePattern = path.join(
      util.generatePathToComponentRoot({
        context,
        component,
        root: context.opts.stagingPath,
        scripts: configPaths.src.javascript
      }),
      '**/*.js'
    );
  }
  return glob.sync(util.posixPattern(componentFilePattern));
}

module.exports = optimizeComponent;
