/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const fs = require('fs-extra');
const util = require('./util');
const injectorUtil = require('./injectorUtil');
const pathGenerator = require('./rjsConfigGenerator');
const path = require('path');

function _getInjectSource(mainJs) {
  return util.readFileSync(mainJs);
}

function _getInjectContent(buildType, mainPathMapping) {
  let injectCode = '\n{\n';
  Object.keys(mainPathMapping).forEach((key) => {
    const lib = mainPathMapping[key];
    injectCode += `  '${key}':${lib},\n`;
  });

  injectCode = injectCode.slice(0, -2);
  injectCode += '\n}\n';
  return injectCode;
}

//
// Update paths, baseUrl, and bunldes in the requirejs.config.
// Note that for release builds, this affects bundles.js,
// and debug builds affect main.js.
//
// The following requirejs.config objects are updated:
//
//   - paths (for release and debug builds)
//     paths is injected from config.mainPathMapping
//   - baseUrl (for release and debug builds)
//     baseUrl is updated if it has been specified in the path_mapping file.
//   - bundles (for release builds only)
//
function _replaceReleasePath(context, buildType, config, injectedFile) {
  const injectSrc = _getInjectSource(injectedFile);
  const startTag = config.startTag;
  const endTag = config.endTag;
  const pattern = injectorUtil.getInjectorTagsRegExp(startTag, endTag);
  const lineEnding = injectorUtil.getLineEnding(injectSrc);

  let injectContent = '';

  if (config.mainPathMapping) {
    const pathMapping = (buildType === 'release') ? _restorePathMapping(config.mainPathMapping) : config.mainPathMapping;
    injectContent = _getInjectContent(buildType, pathMapping);
    injectContent = injectContent.replace(/'/g, '"');
    injectContent = injectContent.replace(/\\/g, '/');
  } else {
    // if no main path JSON, extract the requirejs config section from source
    const result = pattern.exec(injectSrc);
    injectContent = result[3];
  }

  let injectResult = injectorUtil.replaceInjectorTokens({
    content: injectSrc,
    pattern,
    replace: injectContent,
    eol: lineEnding,
    startTag,
    endTag
  });

  const bundlesObj = pathGenerator.getBundlesMapping(context, true);
  // Update context, making bundles visible to hooks.
  if (buildType === 'release' && bundlesObj && Object.keys(bundlesObj).length) {
    context.opts.requireJs.bundles = bundlesObj; // eslint-disable-line no-param-reassign
  }

  const baseUrlPattern = /([\t ]*)('|")?baseUrl['"]?\s*:\s*(.*?),/gi;
  const baseUrlResult = baseUrlPattern.exec(injectResult);
  const baserUrlInjectorConfig = context.opts.injectBaseurl;
  const baseUrlStartTag = baserUrlInjectorConfig.startTag;
  const baseUrlEndTag = baserUrlInjectorConfig.endTag;
  const baseUrlInjectorPattern = injectorUtil.getInjectorTagsRegExp(
    baseUrlStartTag,
    baseUrlEndTag
  );
  const baseUrlInjectorPatternResult = baseUrlInjectorPattern.test(injectResult);

  //
  // Inject baseUrl entry in requirejs config
  // Also inject any bundles (derived from packs)
  //
  if (baseUrlResult) {
    const indentStr = baseUrlResult[1];
    const stringChar = baseUrlResult[2] || "'";
    const baseUrlValue = util.readPathMappingJson().baseUrl;

    let newBaseUrl;
    if (baseUrlValue && baseUrlInjectorPatternResult) {
      newBaseUrl = `${indentStr}baseUrl: ${stringChar}${baseUrlValue}${stringChar},`;
    } else {
      newBaseUrl = baseUrlResult[0];
    }

    // Inject the bundles object for release builds.
    // Insert after baseUrl.
    if (buildType === 'release' && bundlesObj && Object.keys(bundlesObj).length) {
      newBaseUrl = `${newBaseUrl}\nbundles: ${JSON.stringify(bundlesObj, null, 1)},`;
    }
    injectResult = injectResult.replace(baseUrlPattern, newBaseUrl);
  } else if (baseUrlInjectorPatternResult) {
    const configPaths = util.getConfiguredPaths();
    let newBaseUrl = `baseUrl: '${configPaths.src.javascript}',`;
    if (buildType === 'release' && bundlesObj && Object.keys(bundlesObj).length) {
      newBaseUrl = `${newBaseUrl}\nbundles: ${JSON.stringify(bundlesObj, null, 1)},`;
    }
    injectResult = injectorUtil.replaceInjectorTokens({
      content: injectResult,
      pattern: baseUrlInjectorPattern,
      replace: newBaseUrl,
      eol: lineEnding,
      startTag: baseUrlStartTag,
      endTag: baseUrlEndTag
    });
  }
  return injectResult;
}

function _replacePreactImport(buildType, config, injectedFile) {
  const injectSrc = _getInjectSource(injectedFile);
  const startTag = config.startTag;
  const endTag = config.endTag;
  const pattern = injectorUtil.getInjectorTagsRegExp(startTag, endTag);
  const lineEnding = injectorUtil.getLineEnding(injectSrc);

  let injectContent = '';

  if (buildType === 'release') {
    injectContent = '';
  } else {
    injectContent = "// To learn more about preact devtools see https://preactjs.github.io/preact-devtools/\nimport 'preact/debug';";
  }

  const injectResult = injectorUtil.replaceInjectorTokens({
    content: injectSrc,
    pattern,
    replace: injectContent,
    eol: lineEnding,
    startTag,
    endTag
  });

  return injectResult;
}

// Update index.ts at the app root, if it exists, and if in debug mode
function _writeDebugPreactImportToFile(context) {
  const config = context.opts.injectPreactImport;
  const buildType = context.buildType;

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(config.indexTs)) {
      resolve(context);
      return;
    }

    const injectedContent =
    _replacePreactImport(buildType, config, config.indexTs);

    fs.outputFile(config.indexTs, injectedContent, (err) => {
      if (err) {
        reject(err);
      }
      resolve(context);
    });
  });
}

//
// Update config.mainJs, replacing the path mappings that are delimited by
// the "injector" comment tags.
// (see defaultconfig.js for the default tags (look for "injectPaths")).
//
function _writeRequirePathToFile(context) {
  const config = context.opts.injectPaths;
  const buildType = context.buildType;

  return new Promise((resolve, reject) => {
    const destDir = (buildType === 'release') ? config.destMainJs : config.mainJs;

    if (!fs.existsSync(config.mainJs)) {
      resolve(context);
      return;
    }

    let injectedContent =
      _replaceReleasePath(context, buildType, config, config.mainJs);

    injectedContent = _injectRequireMapAliases(context, injectedContent);

    fs.outputFile(destDir, injectedContent, (err) => {
      if (err) {
        reject(err);
      }
      resolve(context);
    });
  });
}

//
// Updates the main.js file, injecting entries for the map: { ... }
// field as part of the requireJs configuration object depending on
// the presence of the requireMap attribute in path_mapping.json file
// entries.
//
function _injectRequireMapAliases(context, injectedContent) {
  const mapObject = {};
  const stagingFolder = context.opts.stagingPath || context.platform;
  const pathToPathMappingInStaging = path.join(stagingFolder, 'js', 'path_mapping.json');
  const regexCommaBeforeEndInjector = /\/\/\s*injector\s*:requireMap\s*{\s*},\s*\/\/\s*endinjector\s*/gm;
  const regexCommaAfterEndInjector = /\/\/\s*injector\s*:requireMap\s*{\s*}\s*\/\/\s*endinjector\s*,/gm;
  const hasCommaBeforeEndInjector = regexCommaBeforeEndInjector.test(injectedContent);
  const hasCommaAfterEndInjector = regexCommaAfterEndInjector.test(injectedContent);
  if (fs.existsSync(pathToPathMappingInStaging) &&
    (hasCommaBeforeEndInjector || hasCommaAfterEndInjector)) {
    const config = context.opts.injectRequireMap;
    const startTag = config.startTag;
    const endTag = config.endTag;
    const pattern = injectorUtil.getInjectorTagsRegExp(startTag, endTag);
    const lineEnding = injectorUtil.getLineEnding(injectedContent);
    const pathMappingObject = util.readJsonAndReturnObject(pathToPathMappingInStaging);
    const pathMappingLibsObject = (pathMappingObject && pathMappingObject.libs) || {};
    const pathMappingLibsArray = Object.getOwnPropertyNames(pathMappingLibsObject);

    pathMappingLibsArray.forEach((pathMappingLib) => {
      const mappedPaths = pathMappingLibsObject[pathMappingLib].requireMap;
      if (Array.isArray(mappedPaths)) {
        mappedPaths.forEach((mappedPath) => {
          mapObject[mappedPath] = pathMappingLib;
        });
      }
    });

    const injectContent = Object.keys(mapObject).length === 0 ? { } : { '*': mapObject };

    // This should encounter for the cases when the comma is after
    // or before the endInjector token in the main.js file in the
    // src folder during the replacement process:
    let replaceContent;

    if (hasCommaBeforeEndInjector) {
      replaceContent = `${JSON.stringify(injectContent, null, 2)},`;
    } else if (hasCommaAfterEndInjector) {
      replaceContent = JSON.stringify(injectContent, null, 2);
    }

    const injectResult = injectorUtil.replaceInjectorTokens({
      content: injectedContent,
      pattern,
      replace: replaceContent,
      eol: lineEnding,
      startTag,
      endTag
    });

    return injectResult;
  }

  return injectedContent;
}


function _setMainPathMapping(context, pathsMapping) {
  const config = context.opts.injectPaths;
  const newContext = context;
  return new Promise((resolve) => {
    config.mainPathMapping = pathsMapping;
    newContext.opts.injectPaths = config;

    resolve(newContext);
  });
}

/**
  _updatePathMappingsInTestConfigs updates the test
  config files to ensure that they contain updated
  path mappings during the building process.
  @param {object} pathsObj object with path mappings
  @param {object} context
  @return {promise}
**/
function _updatePathMappingsInTestConfigs(context, pathsObj) {
  const pathToMainTestFile = path.join(util.destPath(), 'test-config', 'test-main.js');
  const pathToJestConfigFile = path.join(util.destPath(), 'test-config', 'jest.config.js');
  return new Promise((resolve) => {
    if (fs.existsSync(pathToMainTestFile) && context.buildType === 'dev') {
      _addComponentsIntoTestMainFile(pathToMainTestFile, pathsObj);
    } else if (fs.existsSync(pathToJestConfigFile) && context.buildType === 'dev') {
      _addComponentsIntoJestTestConfig(pathToJestConfigFile, pathsObj);
    }
    resolve(context);
  });
}

/**
  _addComponentsIntoTestMainFile updates the test-main.js file
  to ensure that the built components' paths are properly mapped
  @param {object} pathsObj object with path mappings
  @param {string} pathToMainTestFile
**/
function _addComponentsIntoTestMainFile(pathToMainTestFile, pathsObj) {
  const fileContent = fs.readFileSync(pathToMainTestFile, { encoding: 'utf-8' });
  const regex = /paths:\s{(?<exportedObjectContent>.*?)}/gms;
  const match = regex.exec(fileContent);
  const updatedPathMappings = JSON.stringify({
    // we are parsing the exported oject content here to ensure
    // that, in case there are any paths configured by the user
    // in the test-main.js file that are not in pathsObj, the paths
    // are properly updated.
    ...JSON.parse(`{${match.groups.exportedObjectContent || ''}}`),
    ...pathsObj,
    sinon: '../../node_modules/sinon/pkg/sinon',
    chai: '../../node_modules/chai/chai'
  },
  null,
  4).replaceAll('"\'', '"')
    .replaceAll('\'"', '"');
  const updatedFileContent = fileContent.replaceAll(
    `{${match.groups.exportedObjectContent}}`,
    updatedPathMappings
  );
  fs.writeFileSync(pathToMainTestFile, updatedFileContent);
}

/**
  _addComponentsIntoJestTestConfig updates the moduleNameMapper
  to ensure that the built components' paths are properly mapped
  @param {object} pathsObj object with path mappings
  @param {string} pathToJestConfigFile
**/
function _addComponentsIntoJestTestConfig(pathToJestConfigFile, pathsObj) {
  const updatedModuleNameMapper = {};
  const configPaths = util.getConfiguredPaths();
  const regex = /moduleNameMapper:\s*{(?<extractedModuleNameMapper>.*)},/gms;
  const jestConfigFileContent = fs.readFileSync(pathToJestConfigFile, { encoding: 'utf-8' });
  const pathToComponentsInSrc = path.join(
    util.destPath(),
    configPaths.src.common,
    configPaths.components
  );

  fs.readdirSync(pathToComponentsInSrc).forEach((component) => {
    const pathToTestsFolder = path.join(pathToComponentsInSrc, component, '__tests__');
    if (fs.existsSync(pathToTestsFolder) && pathsObj[component]) {
      const referencePathInWeb = path.join(
        '<rootDir>',
        configPaths.staging.web,
        pathsObj[component].replaceAll(/\'/gm, ''), // eslint-disable-line no-useless-escape
        '$1'
      );
      updatedModuleNameMapper[`${component}/(.*)`] = referencePathInWeb;
    }
  });

  if (Object.getOwnPropertyNames(updatedModuleNameMapper).length !== 0) {
    const executedRegex = regex.exec(jestConfigFileContent);
    const extractedGroups = executedRegex && executedRegex.groups;
    const extractedNameMapper = extractedGroups && extractedGroups.extractedModuleNameMapper;
    if (extractedNameMapper) {
      fs.writeFileSync(
        pathToJestConfigFile,
        jestConfigFileContent.replace(
          extractedNameMapper,
          JSON.stringify({
            ...JSON.parse(`{${extractedNameMapper}}`),
            ...updatedModuleNameMapper
          },
          false,
          6
          ).replaceAll('{', '')
            .replaceAll('}', '')
        )
      );
    }
  }
}

/**
  In rjsConfigGenerator we assign "empty:" value
  to the path mapping for already optimized components
  we need to restore it here to get a correct path injected into
  bundle.js file
  @param {object} pathsObj object with path mappings
  @return {object} restored path mappings object
**/
function _restorePathMapping(pathsObj) {
  const componentCache = util.getComponentsCache();
  const properties = Object.getOwnPropertyNames(pathsObj);
  properties.forEach((property) => {
    if (pathsObj[property] === "'empty:'" && componentCache[property].pathMap) {
      pathsObj[property] = `"${componentCache[property].pathMap}"`; // eslint-disable-line no-param-reassign
      delete componentCache[property].pathMap;
    }
  });
  return pathsObj;
}

module.exports = {
  injectPaths: function _injectpaths(context) {
    try {
      const newContext = context;
      const pathsObj = pathGenerator.getPathsMapping(context, false, false);
      newContext.opts.requireJs = pathGenerator.updateRJsOptimizerConfig(context);
      return _setMainPathMapping(newContext, pathsObj)
        .then(_writeRequirePathToFile)
        .then(_updatePathMappingsInTestConfigs(newContext, pathsObj))
        .then(() => Promise.resolve(newContext));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  injectTs: function _injectTs(context) {
    return new Promise((resolve, reject) => {
      try {
        const newContext = context;
        _writeDebugPreactImportToFile(newContext)
          .then(() => {
            resolve(newContext);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
};
