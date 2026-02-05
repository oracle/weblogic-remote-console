/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const path = require('path');
const util = require('../util');
const fs = require('fs-extra');
const glob = require('glob');
const CONSTANTS = require('../constants');
const pathGenerator = require('../rjsConfigGenerator');

/**
 * ## generateComponentsCache
 *
 * Generate a cache which maps each component's* full name to
 * a map containing it's component.json, import name, etc
 *
 * The component cache implements the following fault tolerant properties:
 *  For .tsx (vcomponent) files of pack member's:
 *   - Missing @metadata pack
 *   - Missing @ojmetadata version
 *   - Missing @metadata jetVersion
 *  For any pack:
 *   - Missing dependencies from component.json
 *
 * @param {object} options
 * @param {object} options.context build context
 * @returns {object} components cache
 */
function generateComponentsCache({ context }) {
  const componentsCache = {};
  const configPaths = util.getConfiguredPaths();
  const javascriptComponentsPath = path.join(
    configPaths.src.common,
    configPaths.src.javascript,
    configPaths.components
  );
  const typescriptComponentsPath = path.join(
    configPaths.src.common,
    configPaths.src.typescript,
    configPaths.components
  );
  const exchangeComponentsPath = path.join(configPaths.exchangeComponents);
  const componentBasePaths = [
    exchangeComponentsPath,
    typescriptComponentsPath
  ];
  if (javascriptComponentsPath !== typescriptComponentsPath) {
    // For the none-VDOM app case in which js and ts are different folders
    componentBasePaths.push(javascriptComponentsPath);
  }
  componentBasePaths.forEach((componentBasePath) => {
    getComponentsInDirectory({
      directory: componentBasePath
    }).forEach((component) => {
      const componentPath = path.join(componentBasePath, component);
      const componentJson = util.getComponentJson({ context, component });
      const { name: componentName, type } = componentJson;
      if (!componentJson.jetVersion && type !== CONSTANTS.COMPONENT_TYPE.REFERENCE) {
        componentJson.jetVersion = util.getJETVersion(true);
      }
      componentsCache[componentName] = generateComponentCache({
        context,
        componentJson,
        componentPath
      });
      if (type === 'pack' || type === CONSTANTS.PACK_TYPE.MONO_PACK) {
        const packName = componentName;
        const hasDependenciesToken = util.hasDependenciesToken(componentJson);
        if (hasDependenciesToken) {
          componentJson.dependencies = {};
        }
        const componentsInPack = getComponentsInDirectory({
          directory: path.join(componentBasePath, packName)
        });
        // In mono-pack, we allow @contents@ flag to be replaced by
        // object list of the components in the mono-pack;
        if (type === CONSTANTS.PACK_TYPE.MONO_PACK) {
          addComponentToPackContents({
            componentBasePath,
            packComponentJson: componentJson,
            componentsInPack
          });
        }
        const monoPackDependencies = [];
        // We need the what would be mono-pack dependencies in the form <packName-componentName>
        // for components in the mono-pack. We use this info to promote depencies in the components
        // from the mono-pack whose pack is not mono-pack:
        componentsInPack.forEach((componentInPack) => {
          monoPackDependencies.push(`${packName}-${componentInPack}`);
        });
        componentsInPack.forEach((componentInPack) => {
          const componentInPackPath = path.join(componentBasePath, packName, componentInPack);
          const componentInPackComponentJson = util.getComponentJson({
            context,
            component: componentInPack,
            pack: packName
          });
          const { name: componentInPackName } = componentInPackComponentJson;
          if (componentInPackComponentJson.type === 'pack' ||
              componentInPackComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
            util.log.error(`Cannot have a component of type "pack" within a pack: ${packName}/${componentInPackName} `);
          }
          const fullComponentName = `${packName}-${componentInPackName}`;
          const packCompJson = componentsCache[packName].componentJson;
          // Check for missing version, jetVersion, and pack
          // in child component.
          // Use info from pack to complete any missing properties.
          if (util.hasMissingProperty(componentInPackComponentJson, 'version')) {
            componentInPackComponentJson.version = packCompJson.version;
          }
          if (util.hasMissingProperty(componentInPackComponentJson, 'jetVersion') &&
          componentInPackComponentJson.type !== CONSTANTS.COMPONENT_TYPE.REFERENCE) {
            componentInPackComponentJson.jetVersion = packCompJson.jetVersion;
          }
          if (util.hasMissingProperty(componentInPackComponentJson, 'pack')) {
            componentInPackComponentJson.pack = packName;
          }
          // eslint-disable-next-line max-len
          if (type === CONSTANTS.PACK_TYPE.MONO_PACK) {
            // eslint-disable-next-line max-len
            promoteDependencyInMonoPack(monoPackDependencies, componentInPackComponentJson, packCompJson);
          }
          if (hasDependenciesToken && type !== CONSTANTS.PACK_TYPE.MONO_PACK) {
            packCompJson.dependencies[fullComponentName] = componentInPackComponentJson.version;
          }
          componentsCache[fullComponentName] = generateComponentCache({
            context,
            componentJson: componentInPackComponentJson,
            componentPath: componentInPackPath,
            pack: packName
          });
        });
      }
    });
  });
  return componentsCache;
}

/**
 *
 * ## getComponentsInDirectory
 *
 * Get the names of all the components in the given directory
 *
 * @param {object} options
 * @param {string} options.directory directory in which to look for
 * components in
 * @returns {string[]} list of the names of components in the given
 * directory
 */
function getComponentsInDirectory({ directory }) {
  return [
    ...getCompositeComponentsInDirectory({ directory }),
    ...getVComponentsInDirectory({ directory })
  ];
}

/**
 *
 * ## getCompositeComponentsInDirectory
 *
 * Get the names of all the composite components in the given directory
 *
 * @param {object} options
 * @param {string} options.directory directory in which to look for
 * composite components in
 * @returns {string[]} list of the composite components in the given
 * directory
 */
function getCompositeComponentsInDirectory({ directory }) {
  return glob.sync(`*/${CONSTANTS.JET_COMPONENT_JSON}`, { cwd: directory })
    .map(componentPath => (path.dirname(componentPath)));
}

/**
 *
 * ## getVComponentsInDirectory
 *
 * Get the names of all the  vcomponents in the given directory
 *
 * @param {object} options
 * @param {string} options.directory directory in which to look for
 * vcomponents in
 * @returns {string[]} list of the vcomponents in the given
 * directory
 */
function getVComponentsInDirectory({ directory }) {
  return util.getVComponentsInFolder({ folder: directory });
}

/**
 *
 * ## generateComponentCache
 *
 * Generate a cache which maps this component's
 * full name to a map containing its component.json, import name
 * etc
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 * @param {string} options.pack
 * @returns {object} map containing this component's
 * componentJson, import name etc
 */
function generateComponentCache({ context, componentJson, componentPath, pack }) {
  const component = componentJson.name;
  const importName = generateComponentImportName({
    context,
    componentJson,
    pack
  });
  if (pack && !util.hasProperty(componentJson, 'pack')) {
    // eslint-disable-next-line no-param-reassign
    componentJson.pack = pack;
  }
  return {
    isLocal: isLocalComponent({ componentPath }),
    isVComponent: util.isVComponent({ pack, component }),
    isTypescriptComponent: util.isTypescriptComponent({ pack, component }),
    srcPath: componentPath,
    builtPath: generateComponentBuiltPath({ context, pack, componentJson }),
    importName,
    componentJson
  };
}

/**
 * ## generateComponentImportName
 *
 * Generate this component's import name. The import names
 * are generated as follows:
 * - Singleton component = componentName
 * - JET pack = packName
 * - Component inside JET pack = packName/componentName
 * - Reference component = mapping defined in component.json
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 * @param {string} options.pack
 * @returns {string} import name
 */
function generateComponentImportName({ context, componentJson, pack }) {
  const { name: componentName } = componentJson;
  let importName;
  if (componentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE) {
    const mapping = pathGenerator.getReferencePath(context.buildType, true, componentJson);
    importName = Object.keys(mapping).pop();
  } else {
    importName = pack ? `${pack}/${componentName}` : componentName;
  }
  return importName;
}

/**
 * ## generateComponentBuiltPath
 *
 * @param {object} options
 * @param {string} options.pack
 * @param {object} options.componentJson
 * @returns {string} component built path
 */
function generateComponentBuiltPath({ context, pack, componentJson }) {
  const configPaths = util.getConfiguredPaths();
  return util.generatePathToComponentRoot({
    context,
    pack,
    component: componentJson.name,
    root: context.opts.stagingPath,
    scripts: configPaths.src.javascript
  });
}

/**
 * ## isLocalComponent
 *
 * @param {object} options
 * @param {string} options.componentPath
 * @returns {boolean} whether the component
 * path corresponds to a local component
 */
function isLocalComponent({ componentPath }) {
  const configPaths = util.getConfiguredPaths();
  return componentPath.startsWith(configPaths.src.common);
}

/**
 * ## promoteDependencyInMonoPack
 * This will ensure that only the dependencies which are not
 * of the components from the same mono-pack are included in
 * the mono-pack dependencies object.
 * @param {Array} monoPackDependencies
 * @param {object} componentJson
 * @param {object} packComponentJson
 *
 */
function promoteDependencyInMonoPack(monoPackDependencies, componentJson, packComponentJson) {
  const componentDependencies = componentJson.dependencies;
  const dependenciesNames = new Set(monoPackDependencies);
  // eslint-disable-next-line max-len
  const dependenciesArray = componentDependencies ? Object.getOwnPropertyNames(componentDependencies) : [];
  dependenciesArray.forEach((dependency) => {
    if (!dependenciesNames.has(dependency) && packComponentJson.dependencies) {
      // eslint-disable-next-line no-param-reassign
      packComponentJson.dependencies[dependency] = componentDependencies[dependency];
    }
  });
}

/**
 * ## addComponentToPackContents
 *
 * @param { string } componentBasePath
 * @param { object } packComponentJson
 * @param { Array } componentsInPack
 */
function addComponentToPackContents({ componentBasePath, packComponentJson, componentsInPack }) {
  let componentJson;
  const contentArray = [];
  componentsInPack.forEach((content) => {
    if (util.isLocalComponent({ pack: packComponentJson.name, component: content })) {
      const pathToComponentJson = path.join(componentBasePath, content, 'component.json');
      if (fs.existsSync(pathToComponentJson)) {
        componentJson = fs.readJSONSync(pathToComponentJson);
      }
      if (componentJson && componentJson.type === CONSTANTS.COMPONENT_TYPE.RESOURCE) {
        contentArray.push({ name: `${content}`, type: CONSTANTS.COMPONENT_TYPE.RESOURCE });
      } else {
        contentArray.push({ name: `${content}` });
      }
    }
  });

  if (contentArray.length !== 0 && packComponentJson.contents &&
      Array.isArray(packComponentJson.contents)) {
    const index = packComponentJson.contents.indexOf(CONSTANTS.MONO_PACK_CONTENTS_TOKEN);
    // Check if the "@contents@" flag exists--meaning index > -1.
    // If so, then remove it from the list and update the list with
    // components in the mono-pack
    if (index !== -1) {
      packComponentJson.contents.splice(index, 1);
      // eslint-disable-next-line no-param-reassign
      packComponentJson.contents = [...packComponentJson.contents, ...contentArray];
    }
  }
}

module.exports = generateComponentsCache;
