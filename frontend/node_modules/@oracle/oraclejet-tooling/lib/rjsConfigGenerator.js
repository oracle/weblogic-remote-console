/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const path = require('path');
const util = require('./util');
const CONSTANTS = require('./constants');
const config = require('./config');
const fs = require('fs-extra');

function _getPathMappingObj(buildType, masterJson, requirejs) {
  const obj = {};
  const useCdn = masterJson.use;
  const configPaths = util.getConfiguredPaths();
  const versions = util.getLibVersionsObj();
  Object.keys(masterJson.libs).forEach((lib) => {
    const libPath = _getLibPath(buildType, masterJson.libs[lib], useCdn, masterJson.cdns,
      lib, requirejs, versions);
    if (libPath) obj[lib] = libPath;
  });

  // fix bug for require css broken link to css-builder.js
  let lp = 'libs/require-css/css-builder';
  obj['css-builder'] = path.join(lp, '..', path.basename(lp, path.extname(lp)));
  lp = 'libs/require-css/normalize';
  let normalize = path.join(lp, '..', path.basename(lp, path.extname(lp)));
  obj.normalize = normalize;
  obj['ojs/normalize'] = normalize;
  obj[configPaths.components] = configPaths.components;
  if (!requirejs) {
    obj['css-builder'] = `'${obj['css-builder']}'`;
    normalize = `'${obj.normalize}'`;
    obj.normalize = normalize;
    obj['ojs/normalize'] = normalize;
    obj[configPaths.components] = `'${configPaths.components}'`;
  }
  return obj;
}

function _getLibPath(buildType, libObj, useCdn, cdnUrls, libName, requirejs, versions) {
  // if user defines cdn path and set use to "cdn" in path_mapping.json
  //  prefer to use cdn path over local path
  const buildTypeLibObj = buildType;
  if (_isCdnPath(libObj, useCdn, cdnUrls, buildType, libName)) {
    // if the lib's cdn reference points to a bundles-config
    if (_isCdnBundle(libObj, cdnUrls) && !requirejs) {
      return null;
    }

    const prefix = typeof cdnUrls[libObj.cdn] === 'object'
      ? cdnUrls[libObj.cdn].prefix : cdnUrls[libObj.cdn];

    const suffix = libObj[buildTypeLibObj].pathSuffix ? libObj[buildTypeLibObj].pathSuffix : '\'';
    return _processVersionToken(libName, `'${prefix}/${libObj[buildType].cdnPath}${suffix}`, versions);
  }

  let libPath = _processVersionToken(libName, libObj[buildTypeLibObj].path, versions);
  if (path.extname(libPath) === '.js') {
    libPath = path.join(libPath, '..', path.basename(libPath, path.extname(libPath)));
  }

  libPath = requirejs ? `${libPath}` : `'${libPath}`;
  let suffix = libObj[buildTypeLibObj].pathSuffix ? libObj[buildTypeLibObj].pathSuffix : '\'';
  if (requirejs && suffix.substring(suffix.length - 1) === "'") {
    // remove it
    suffix = suffix.substring(0, suffix.length - 1);
  }

  libPath += suffix;

  return libPath;
}

function _isCdnPath(libObj, useCdn, cdnUrls, buildType, libName) {
  const pluginLibs = ['text', 'ojcss', 'ojs/ojcss', 'css', 'normalize', 'ojs/normalize', 'css-builder', 'ojL10n'];
  const pluginLib = (buildType === 'release' && pluginLibs.indexOf(libName) > -1);
  return (useCdn === 'cdn'
    && !pluginLib
    && libObj.cdn !== undefined
    && cdnUrls[libObj.cdn] !== undefined
    && libObj[buildType].cdnPath !== undefined);
}

function _isCdnBundle(libObj, cdnUrls) {
  const cdnName = (libObj.cdn === '3rdParty') ? 'jet' : libObj.cdn;
  return (typeof cdnUrls[cdnName] === 'object' && cdnUrls[cdnName].config && cdnUrls[cdnName].config.length > 0);
}

function _getCdnExchangeCompPath(buildType, masterJson, exchangeCompJson) {
  const useCdn = (masterJson.use === 'cdn');
  if (useCdn) {
    const cdnSection = exchangeCompJson.paths ? exchangeCompJson.paths.cdn : null;
    if (cdnSection) {
      return buildType === 'release' ? cdnSection.min : cdnSection.debug;
    }
  }
  return null;
}

function _processVersionToken(libName, libPath, versions) {
  return Object.keys(versions).indexOf(libName) !== -1
    ? util.replaceVersionToken(libPath, versions, libName) : libPath;
}


function _getRJsConfig(buildType, masterJson, oldConfig) {
  // Update the requirejs optimizer config to skip bundling any cdn resouces
  const newConfig = oldConfig;
  const useCdn = masterJson.use;
  Object.keys(masterJson.libs).forEach((lib) => {
    if (_isCdnPath(masterJson.libs[lib], useCdn, masterJson.cdns, buildType, lib)) {
      if (newConfig.paths === undefined) {
        newConfig.paths = {};
      }
      newConfig.paths[lib] = 'empty:';
    }
  });
  // bug fix for require-css broken link to css-build.js
  if (config.exclude === undefined) {
    newConfig.exclude = [];
  }
  if (!newConfig.exclude.includes('css-builder')) {
    newConfig.exclude.push('css-builder');
  }
  if (!newConfig.exclude.includes('normalize')) {
    newConfig.exclude.push('normalize');
  }

  return newConfig;
}

/**
 * ## _getCcaRJsConfig
 * @private
 * @param {String} buildType
 * @param {Object} masterJson
 * @param {Object} config
 * @returns {Object}
 */
function _getCcaRJsConfig(buildType, masterJson, oldConfig) {
  // Update the requirejs optimizer config to skip bundling any minified cca components
  const newConfig = oldConfig;
  const dependenciesObj = util.getOraclejetConfigJson().dependencies;
  const configPaths = util.getConfiguredPaths();
  // Update build config with reference components
  const componentList = util.getDirectories(`./${configPaths.exchangeComponents}`);
  componentList.forEach((component) => {
    const componentDirPath = `./${configPaths.exchangeComponents}/${component}/${CONSTANTS.JET_COMPONENT_JSON}`;
    const componentJson = util.readJsonAndReturnObject(`${componentDirPath}`);
    if (componentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE) {
      // Should cdn be used? && is paths.cdn property defined?
      if (masterJson.use === 'cdn' && componentJson.cdn) {
        // Is either release or debug url available?
        if (componentJson.cdn.min || componentJson.cdn.debug) {
          newConfig.paths[(componentJson.paths && componentJson.paths.name) || component] = 'empty:';
        }
      }
    }
  });

  // bug fix for require-css broken link to css-build.js
  if (newConfig.exclude === undefined) {
    newConfig.exclude = [];
  }

  if (!newConfig.exclude.includes('css-builder')) {
    newConfig.exclude.push('css-builder');
  }
  if (!newConfig.exclude.includes('normalize')) {
    newConfig.exclude.push('normalize');
  }

  if (!dependenciesObj) return newConfig;
  Object.keys(dependenciesObj).forEach((dependency) => {
    const version = _isPack(dependenciesObj[dependency]) ?
      dependenciesObj[dependency].version : dependenciesObj[dependency];
    if (buildType === 'release' && _isMinified(dependency, version)) newConfig.paths[dependency] = 'empty:';
  });
  return newConfig;
}

function _constructComponentPath(retObj, npmPackageName) {
  let finalPath = '';
  if (!retObj.npmPckgInitFileRelativePath) return finalPath;
  if (retObj.npm) {
    // Get only the file name
    const npmPckgInitFileNameArray = retObj.npmPckgInitFileRelativePath.split('/');

    let npmPckgInitFileName = npmPckgInitFileNameArray[npmPckgInitFileNameArray.length - 1];
    npmPckgInitFileName = npmPckgInitFileName.replace('.js', '');
    finalPath = `libs/${npmPackageName}/${npmPckgInitFileName}`;
  } else {
    finalPath = retObj.npmPckgInitFileRelativePath;
  }
  return finalPath;
}


/**
 * ## _getReferencePathInternal
 * @private
 * @param {String} buildType
 * @param {Boolean} requirejs
 * @param {Object} dependencyComponentJson
 * @returns {Object}
 *
 * Assign the proper reference paths, returning a pathMappingObj.
 * For reference components, the pathMappingObject property is set to:
 * (a) paths.name (if it exists), otherwise (b) the package name.
 */
function _getReferencePathInternal(buildType, requirejs, dependencyComponentJson) {
  const pathMappingObj = {};
  const npmPackageName = dependencyComponentJson.package;
  const npmPathName = (dependencyComponentJson.paths && dependencyComponentJson.paths.name) ||
        npmPackageName;
  const retObj = util.getNpmPckgInitFileRelativePath(dependencyComponentJson, buildType);
  const finalPath = _constructComponentPath(retObj, npmPackageName);
  pathMappingObj[npmPathName] = requirejs ? finalPath : `'${finalPath}'`; // eslint-disable-line
  return pathMappingObj;
}

/**
 * ## _getExchangeCcaPathMapping
 * @private
 * @param {Object} context
 * @param {String} buildType
 * @param {Object} masterJson
 * @param {Boolean} requirejs
 * @returns {Object}
 */
function _getExchangeCcaPathMapping(context, buildType, masterJson, requirejs) {
  let pathMappingObj = {};
  const configPaths = util.getConfiguredPaths();
  const componentsCache = util.getComponentsCache();
  const exchangeComponents = {};
  Object.keys(componentsCache).forEach((component) => {
    const componentCache = componentsCache[component];
    if (
      util.hasProperty(componentCache, 'isLocal') &&
      !componentCache.isLocal &&
      util.hasProperty(componentCache, 'componentJson') &&
      !util.hasProperty(componentCache.componentJson, 'pack')
    ) {
      exchangeComponents[component] = componentCache;
    }
  });
  if (Object.keys(exchangeComponents).length) {
    Object.keys(exchangeComponents).forEach((exchangeComponent) => {
      const exchangeComponentJson = componentsCache[exchangeComponent].componentJson;
      const hasAllowedDependencyScope = exchangeComponentJson.dependencyScope === 'installable' || exchangeComponentJson.dependencyScope === undefined;

      if (hasAllowedDependencyScope) {
        if (exchangeComponentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE) {
          pathMappingObj = {
            ...pathMappingObj,
            ..._getReferencePathInternal(buildType, requirejs, exchangeComponentJson)
          };
        } else {
          let exchangeComponentPath = null;
          const cdnPath = _getCdnExchangeCompPath(buildType, masterJson, exchangeComponentJson);
          if (cdnPath) {
            exchangeComponentPath = cdnPath;
          } else {
            const version = _getValidVersion(exchangeComponentJson.version);
            exchangeComponentPath = path.join(configPaths.components, exchangeComponent);
            if (!util.useUnversionedStructure(context)) {
              exchangeComponentPath = path.join(exchangeComponentPath, version);
            }
            if (buildType === 'release' && _isMinified(exchangeComponent, version)) {
              // Assign the path to "empty:" to avoid re-optimization of the same code
              // causing errors. Keep a copy of the path to already optimized component
              // to be restored during path injection in mainJsInjector.js in function
              // _replaceReleasePath:
              exchangeComponents[exchangeComponent].pathMap = path.join(exchangeComponentPath, 'min');
              exchangeComponentPath = 'empty:';
            }
          }
          // For the case(s) when oj-c is installed as an NPM module and then added by
          // the JET command 'ojet add component', the component then has two paths that
          // it can be mapped to. In such a case, do not allow path overwriting.
          if (exchangeComponent === 'oj-c') {
            const pathMappingObject = _getPathMappingObj(buildType, masterJson, requirejs);
            if (pathMappingObject[exchangeComponent] !== exchangeComponentPath) {
              const errorMessage = `Cannot overwrite path ${pathMappingObject[exchangeComponent]} by the path '${exchangeComponentPath}'.`;
              const toDoMessage = `Either use '${exchangeComponent}' from exchange or node_modules (delete it from the other location) before continuing.`;
              util.log.error(`${errorMessage}\n${toDoMessage}`);
            }
          }
          pathMappingObj[exchangeComponent] = requirejs ? exchangeComponentPath : `'${exchangeComponentPath}'`;
        }
      }
    });
  }
  return pathMappingObj;
}

/**
 * ## _getExchangeBundleMapping
 * @private
 * @param {String} requrejs
 * @returns {Object}
 */
function _getExchangeBundleMapping() {
  const bundlesMappingObj = {};
  const componentsCache = util.getComponentsCache();
  Object.keys(componentsCache).forEach((component) => {
    const componentCache = componentsCache[component];
    // Check exchange component pack for bundles.
    if (util.hasProperty(componentCache, 'isLocal') &&
        !componentCache.isLocal &&
        util.isJETPack({ componentJson: componentCache.componentJson }) &&
        util.hasProperty(componentCache.componentJson, 'bundles')) {
      Object.keys(componentCache.componentJson.bundles).forEach((bundle) => {
        const hasAllowedDependencyScope = componentCache.componentJson.dependencyScope === 'installable' || componentCache.componentJson.dependencyScope === undefined;
        if (hasAllowedDependencyScope) {
          bundlesMappingObj[bundle] = componentCache.componentJson.bundles[bundle];
        }
      });
    }
  });
  return bundlesMappingObj;
}

function _getValidVersion(version) {
  return !isNaN(version.charAt(0)) ? version : version.substring(1);
}

/**
 * ## _getLocalCcaPathMapping
 * @private
 * @returns {Object}
 *
 * Returns a bundlesMappingObj containing all jetpack bundles.
 *
 */
function _getLocalCcaBundleMapping(scriptsFolder) {
  const bundlesMappingObj = {};
  const components = _getLocalComponentArray(scriptsFolder);
  components.forEach((component) => {
    const { componentJson } = util.getComponentsCache()[component];
    if (util.isJETPack({ componentJson }) &&
        util.hasProperty(componentJson, 'bundles')) {
      Object.keys(componentJson.bundles).forEach((bundle) => {
        bundlesMappingObj[bundle] = componentJson.bundles[bundle];
      });
    }
  });
  return bundlesMappingObj;
}

/**
 * ## _getLocalCcaPathMapping
 * @private
 * @returns {Object}
 */
function _getLocalCcaPathMapping(context, buildType, requirejs, scriptsFolder) {
  const pathMappingObj = {};
  const components = _getLocalComponentArray(scriptsFolder);
  components.forEach((component) => {
    const { componentJson } = util.getComponentsCache()[component];
    const version = util.getComponentVersion({ component });
    //
    // (We only add singleton components and the 'top-level' pack (type: 'pack'))
    //
    // The following are NOT added:
    //   - members of a pack (will have a pack property, e.b. pack: packName)
    //   - resource components (type: resource)
    //
    if (!Object.prototype.hasOwnProperty.call(componentJson, 'pack') &&
        !(Object.prototype.hasOwnProperty.call(componentJson, 'type') &&
          (componentJson.type === CONSTANTS.COMPONENT_TYPE.RESOURCE))) {
      const packageName = (componentJson.package ? componentJson.package : componentJson.name);
      const pathName = (componentJson.paths && componentJson.paths.name) || packageName;
      if (componentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE) {
        pathMappingObj[pathName] = _getRefCompLibPath({
          pathName,
          buildType,
          componentJson
        });
      } else {
        pathMappingObj[pathName] = _getLocalComponentPath({
          context,
          component: componentJson.name,
          version
        });
      }
      // target minified directory for release builds.
      if (buildType === 'release') {
        // Use minified directory for all components except type: demo
        if (!(Object.prototype.hasOwnProperty.call(componentJson, 'type') &&
            (componentJson.type === 'demo' || componentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE))) {
          pathMappingObj[pathName] = path.join(pathMappingObj[pathName], 'min');
        }
      }
      pathMappingObj[pathName] = requirejs ? pathMappingObj[pathName] : `'${pathMappingObj[pathName]}'`;
    }
  });
  return pathMappingObj;
}

/**
 * ## _getRefCompLibPath
 * @private
 * @param { String } pathName - to be used as property name in main.js
 * @param { String } buildType - either release or debug
 * @param { Object } componentJson - metadata object
 * @returns { String | Undefined }
 */
function _getRefCompLibPath({ pathName, buildType, componentJson }) {
  let refLibPath;
  const pathMappingJson = util.readPathMappingJson();
  if (pathMappingJson.use === 'local') {
    // Copy the <pathName> modules from the node_modules folder into
    // the web/js/lib folder:
    const pathToLibsInWeb = path.join('web', 'js', 'libs', pathName);
    const nodePath = util.getModulePath(path.join('node_modules', pathName), pathName);
    if (fs.existsSync(nodePath) && !fs.existsSync(pathToLibsInWeb)) {
      fs.copySync(nodePath, pathToLibsInWeb);
    }
    // Get the lib path to be added into main.js/bundle.js and refer to the
    // needed files in web/js/libs/<pathName> folder:
    refLibPath = _getRefCompLibLocalPath({ pathName, buildType, componentJson, pathMappingJson });
  } else if (pathMappingJson.use === 'cdn') {
    // Get the cdn lib path to be added into main.js/bundle.js. There is no
    // need to copy <pathName> modules from the node_modules folder into
    // web/js/lib folder:
    refLibPath = _getRefCompLibCdnPath({ pathName, buildType, componentJson, pathMappingJson });
  }
  return refLibPath;
}

/**
 * ## _getRefCompLibCdnPath
 * @private
 * @param { String } pathName - to be used as property name in main.js
 * @param { String } buildType - either release or debug
 * @param { Object } componentJson - metadata object
 * @param { Object } pathMappingJson - path mapping object
 * @returns { String | Undefined }
 */
function _getRefCompLibCdnPath({ pathName, buildType, componentJson, pathMappingJson }) {
  let refLibPath;
  const pathMappingLibs = pathMappingJson.libs;
  const libsPropertyNames = Object.getOwnPropertyNames(pathMappingLibs);
  if (libsPropertyNames.includes(pathName)) {
    // Release path might not exist, fall back to debug path!
    const libCdn = pathMappingLibs[pathName].cdn;
    const cdnRoot = pathMappingJson.cdns[libCdn];
    let cdnPath = pathMappingLibs[pathName].debug.cdnPath;
    if (buildType === 'release' && pathMappingLibs[pathName].release.cdnPath) {
      cdnPath = pathMappingLibs[pathName].release.cdnPath;
    }
    if (!cdnPath) {
      util.log.warning(`debug.cdnPath and/or release.cdnPath for ${pathName} under property 'libs' not configured correctly in your path_mapping.json.`);
    }
    refLibPath = path.join(cdnRoot, cdnPath);
  } else {
    refLibPath = _getCdnPathFromComponentJson(componentJson, buildType, pathName);
  }
  return refLibPath;
}

/**
 * ## _getCdnPathFromComponentJson
 * @private
 * @param { String } pathName - to be used as property name in main.js
 * @param { String } buildType - either release or debug
 * @param { Object } componentJson - metadata object
 * @returns { String | Undefined }
 */
function _getCdnPathFromComponentJson(componentJson, buildType, pathName) {
  let refLibPath;
  if (componentJson.paths && componentJson.paths.cdn) {
    // Debug path might not exist, fall back to min path.
    refLibPath = componentJson.paths.cdn.debug;
    if (buildType === 'release' && componentJson.paths.cdn.min) {
      refLibPath = componentJson.paths.cdn.min;
    }
    if (!refLibPath) {
      util.log.warning(`paths.cdn.debug and/or paths.cdn.min property for ${pathName} not configured correctly in your component.json.`);
    }
  } else {
    util.log.warning(`paths.cdn property not configured correctly in ${componentJson.name}'s component.json.`);
  }
  return refLibPath;
}

/**
 * ## _getRefCompLibLocalPath
 * @private
 * @param { String } pathName - to be used as property name in main.js
 * @param { String } buildType - either release or debug
 * @param { Object } componentJson - metadata object
 * @param { Object } pathMappingJson - path mapping object
 * @returns { String | Undefined }
 */
function _getRefCompLibLocalPath({ pathName, buildType, componentJson, pathMappingJson }) {
  let refLibPath;
  const pathMappingLibs = pathMappingJson.libs;
  const libsPropertyNames = Object.getOwnPropertyNames(pathMappingLibs);
  if (libsPropertyNames.includes(pathName)) {
    // Release path might not exist, fall back to debug path:
    refLibPath = pathMappingLibs[pathName].debug.path;
    if (buildType === 'release' && pathMappingLibs[pathName].release.path) {
      refLibPath = pathMappingLibs[pathName].release.path;
    }
    if (!refLibPath) {
      util.log.warning(`debug.path and/or release.path for ${pathName} under property 'libs' not configured correctly in your path_mapping.json.`);
    }
  } else {
    refLibPath = _getNpmPathFromComponentJson(componentJson, buildType, pathName);
  }
  return refLibPath;
}

/**
 * ## _getNpmPathFromComponentJson
 * @private
 * @param { String } pathName - to be used as property name in main.js
 * @param { String } refLibPath - path value for the pathName property
 * @param { String } buildType - either release or debug
 * @param { Object } componentJson - metadata object
 * @returns { String | Undefined }
 */
function _getNpmPathFromComponentJson(componentJson, buildType, pathName) {
  let refLibPath;
  if (componentJson.paths && componentJson.paths.npm) {
    // Release path might not exist, fall back to debug path:
    let pathNpm = componentJson.paths.npm.debug;
    if (buildType === 'release' && componentJson.paths.npm.min) {
      pathNpm = componentJson.paths.npm.min;
    }
    if (pathNpm) {
      refLibPath = `libs/${pathName}/${pathNpm}`;
    } else {
      util.log.warning(`paths.npm.debug and/or paths.npm.min property not configured correctly in ${componentJson.name}'s component.json. Using paths.cdn instead.`);
      // It might happen that the npm paths property is not defined in component json file.
      // If that is the case, then fall back to using the cdn property if defined.
      refLibPath = _getCdnPathFromComponentJson(componentJson, buildType, pathName);
    }
  } else {
    util.log.warning(`paths.npm property not configured correctly in ${componentJson.name}'s component.json. Using paths.cdn instead.`);
    // Fall back to using cdn.
    refLibPath = _getCdnPathFromComponentJson(componentJson, buildType, pathName);
  }
  return refLibPath;
}

function _getLocalVComponentPathMapping(context, buildType, requirejs) {
  const pathMappingObj = {};
  const vcomponents = util.getLocalVComponents();
  vcomponents.forEach((component) => {
    const version = util.getVComponentVersion({ component });
    pathMappingObj[component] = _getLocalComponentPath({
      context,
      component,
      version
    });
    if (buildType === 'release') {
      pathMappingObj[component] = path.join(pathMappingObj[component], 'min');
    }
    pathMappingObj[component] = requirejs ? pathMappingObj[component] : `'${pathMappingObj[component]}'`;
  });
  return pathMappingObj;
}

function _getLocalComponentPath({ context, component, version }) {
  const configPaths = util.getConfiguredPaths();
  let componentPath = path.join(
    configPaths.components,
    component
  );
  if (!util.useUnversionedStructure(context)) {
    componentPath = path.join(
      componentPath,
      version
    );
  }
  return componentPath;
}

function _getLocalComponentArray(scriptsFolder) {
  const basePath = path.join(
    config('paths').src.common,
    scriptsFolder,
    config('paths').components
  );
  const localCca = [];
  if (util.fsExistsSync(basePath)) {
    const dirList = util.getDirectories(basePath);
    dirList.forEach((dir) => {
      const componentPath = path.join(basePath, dir, 'component.json');
      if (util.fsExistsSync(componentPath)) {
        const componentObj = util.readJsonAndReturnObject(componentPath);
        if (Object.prototype.hasOwnProperty.call(componentObj, 'name') && componentObj.name === dir) localCca.push(dir);
      }
    });
  }

  return localCca;
}

/**
 * ## _isPack
 * @private
 * @param {Object} dependency
 * @returns {Boolean}
 */
function _isPack(dependency) {
  return Object.prototype.hasOwnProperty.call(dependency, 'components');
}

/**
 * ## _isMinified
 * @public
 * @param {Object} dependency
 * @returns {Boolean}
 */
function _isMinified(dependency, version) {
  // check jet_components and the src/js/composites directories
  const configPaths = util.getConfiguredPaths();
  const exchangePath = path.join(configPaths.exchangeComponents, dependency, 'min');
  const srcPath = path.join(config('paths').src.common, config('paths').src.javascript,
    config('paths').components, dependency, version, 'min');
  return (util.fsExistsSync(exchangePath) || util.fsExistsSync(srcPath));
}

module.exports = {

  getBundlesMapping: function _getPathsMapping(context) {
    if (context.buildType === 'release') {
      const bundleMappingObj =
      Object.assign(
        {},
        _getExchangeBundleMapping(),
        _getLocalCcaBundleMapping(config('paths').src.javascript),
        _getLocalCcaBundleMapping(config('paths').src.typescript)
      );
      return bundleMappingObj;
    }
    return {};
  },

  getPathsMapping: function _getPathsMapping(context, requirejs) {
    const masterJson = util.readPathMappingJson();
    const buildType = context.buildType === 'release' ? 'release' : 'debug';
    const pathMappingObj =
      Object.assign(
        {},
        _getPathMappingObj(buildType, masterJson, requirejs),
        _getExchangeCcaPathMapping(context, buildType, masterJson, requirejs),
        _getLocalCcaPathMapping(context, buildType, requirejs, config('paths').src.javascript),
        _getLocalCcaPathMapping(context, buildType, requirejs, config('paths').src.typescript),
        _getLocalVComponentPathMapping(context, buildType, requirejs),
      );
    return pathMappingObj;
  },

  getMasterPathsMapping: function _getMasterPathsMapping(context, component) {
    const masterJson = util.readPathMappingJson();
    const buildType = context.buildType === 'release' ? 'release' : 'debug';
    const pathMappingObj = _getPathMappingObj(buildType, masterJson, true, false);
    // prepend the relative directory position for a component.
    // calculate component relative path by whether there are versions or not
    const compRelativeDir = util.useUnversionedStructure(context) ? '../../' : '../../../';
    const relativeDir = component ? compRelativeDir : '../../../../';
    Object.keys(pathMappingObj).forEach((lib) => {
      pathMappingObj[lib] = path.join(
        relativeDir,
        pathMappingObj[lib]
      );
    });
    return pathMappingObj;
  },

  getReferencePath: function _getReferencePath(buildType, requirejs, dependencyComponentJson) {
    return _getReferencePathInternal(buildType, requirejs, dependencyComponentJson);
  },

  updateRJsOptimizerConfig: function _updateRJsOptimizer(context) {
    const masterJson = util.readPathMappingJson();
    const rConfig = context.opts.requireJs;

    const buildType = context.buildType === 'release' ? 'release' : 'debug';
    const rjsConfig = _getRJsConfig(buildType, masterJson, rConfig);
    return _getCcaRJsConfig(buildType, masterJson, rjsConfig);
  },

  isCdnPath: _isCdnPath
};
