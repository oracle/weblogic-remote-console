/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const path = require('path');
const glob = require('glob');
const buildCommon = require('../../buildCommon');
const util = require('../../util');
const constants = require('../../constants');

const extractSuffix = (componentBundleName) => {
  // eslint-disable-next-line no-template-curly-in-string
  const token = '${componentName}';
  const index = componentBundleName.indexOf(token);

  if (index === -1) {
    return null;
  }

  return componentBundleName.slice(index + token.length);
};

const buildICUTranslationBundlePlugin = (context) => {
  const pathToComponentsInSrc = util.getComponentsPathInSrc();
  const translation = util.getOraclejetConfigJson().translation;

  if (!translation || util.isObjectEmpty(translation)) {
    util.log.error('Missing translation configurations in your oraclejetconfig.json file. You can add it by running "ojet add translation" and define the translation configurations.');
  }

  const { rootDir, bundleName, componentBundleName } = translation.options || {};

  if (!rootDir) {
    util.log.error('rootDir is required in translation options. Add it to your oraclejetconfig.json file.');
  }

  if (!bundleName) {
    util.log.error('bundleName is required in translation options. Add it to your oraclejetconfig.json file.');
  }

  const afterCompileHandler = (compilation) => {
    const files = new Set(glob.sync([
      `${rootDir}/**/*`,
      `${pathToComponentsInSrc}/**/*`
    ], { absolute: true }));
    files.forEach(file => compilation.fileDependencies.add(path.resolve(file)));
  };

  const watchRunHandler = async (compilation, callback) => {
    const modifiedFiles = compilation.modifiedFiles || [];
    // This will ensure we are testing against a resources path to a component
    // translation bundle:
    const regex = new RegExp(`${pathToComponentsInSrc}/.*?/${constants.RESOURCES}/${constants.NLS}(?:/.*)?$`);

    let componentBundleNameSuffix;
    if (componentBundleName) {
      componentBundleNameSuffix = extractSuffix(componentBundleName);

      if (componentBundleNameSuffix && !componentBundleNameSuffix.endsWith('.json')) {
        componentBundleNameSuffix = `${componentBundleNameSuffix}.json`;
      }
    }

    // compilation.modified is of type set, so change it to array:
    const appLevelBundleFileArray = [...modifiedFiles].filter(
      file => file.endsWith(bundleName)
    );
    const componentLevelBundleFileArray = [...modifiedFiles].filter(
      file => (regex.test(file) && file.endsWith(componentBundleNameSuffix || '-strings.json'))
    );

    if (appLevelBundleFileArray.length > 0) {
      util.log('Changes detected in your bundle\'s json file.');
      await buildCommon.buildICUTranslationsBundleAtAppLevel(context);
    } else if (componentLevelBundleFileArray.length > 0) {
      util.log('Changes detected in your component translation bundle\'s json file.');
      await buildCommon.buildICUTranslationsBundleAtComponentLevel({
        context, modifiedBundleFiles: componentLevelBundleFileArray
      });
    }
    callback();
  };

  return {
    apply: (compiler) => {
      compiler.hooks.afterCompile.tap(constants.BUILD_ICU_TRANSLATION_PLUGIN, afterCompileHandler);
      compiler.hooks.watchRun.tapAsync(constants.BUILD_ICU_TRANSLATION_PLUGIN, watchRunHandler);
    },
  };
};

module.exports = buildICUTranslationBundlePlugin;
