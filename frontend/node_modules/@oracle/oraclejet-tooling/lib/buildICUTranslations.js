/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const fs = require('fs-extra');
const path = require('path');
const util = require('./util');
const constants = require('./constants');
const { exec } = require('child_process');

/**
 * Validates and retrieves necessary variables for translation configuration.
 *
 * @returns {object} An object containing the following properties:
 *   - `l10nBundleBuilder`: The path to the L10n bundle builder.
 *   - `translation`: The translation configuration from oraclejetconfig.json.
 *   - `configuredOptions`: An array of configured translation options.
 */
function _getTranslationConfig() {
  // Check if ICU L10n tool is installed
  if (!util.getIcuL10nPath()) {
    util.log.error('Missing oraclejet ICU L10n tool. Run "ojet add translation" to install the required dependencies.');
    throw new Error('ICU L10n tool not installed');
  }

  // Get the path to the L10n bundle builder
  const l10nBundleBuilder = path.join(util.getIcuL10nPath(), constants.L10N_BUNDLE_BUILDER);

  // Check if the L10n bundle builder exists
  if (!fs.existsSync(l10nBundleBuilder)) {
    util.log.error('Translation bundle builder not found. Ensure "ojet add translation" has been executed successfully.');
    throw new Error('L10n bundle builder not found');
  }

  // Get the translation configuration from oraclejetconfig.json
  const translation = util.getOraclejetConfigJson().translation;

  // Check if translation configuration exists and is not empty
  if (!translation || util.isObjectEmpty(translation)) {
    util.log.error('Missing translation configurations in your oraclejetconfig.json file. You can add it by running "ojet add translation" and define the translation configurations.');
    throw new Error('Translation configuration not found');
  }

  // Get the configured translation options
  let configuredOptions = [];
  const translationOptions = translation.options;
  const requiredOptions = ['rootDir', 'outDir', 'bundleName'];

  // Check if translation options exist and contain all required options
  if (translationOptions) {
    configuredOptions = Object.keys(translationOptions);
    const allRequiredOptionsExist = requiredOptions.every(
      option => configuredOptions.includes(option)
    );
    if (!allRequiredOptionsExist) {
      const missingRequiredOptions = requiredOptions.filter(
        option => !configuredOptions.includes(option)
      );
      util.log.error(`Error while building ICU translations. You are missing required option(s) ${missingRequiredOptions.join(', ')}.`);
      throw new Error(`Missing required translation options: ${missingRequiredOptions.join(', ')}`);
    }
  } else {
    util.log.error('The translation property in the oraclejetconfig.json file must have a sub-property "options", which is currently missing.');
    throw new Error('Translation options not found');
  }

  return {
    l10nBundleBuilder,
    translation,
    configuredOptions,
  };
}

function _executeTranslationCommand(command) {
  // eslint-disable-next-line arrow-body-style
  return new Promise((resolve, reject) => {
    return exec(command, (error) => {
      if (error) {
        util.log.error(`An unexpected error has occurred when building a ICU-translations: ${error}`);
        reject(error);
      }
      resolve();
    });
  });
}

/**
 * Generates the command string for building translations based on the provided options.
 *
 * @param {string} configObj // object with configurations
 *
 * @returns {string} The generated command string for building translations.
 */
function _generateICUTranslationCommand(configObj) {
  const {
    translationOptions,
    l10nBundleBuilder,
    configuredOptions
  } = configObj;

  const isWin = process.platform === 'win32';
  // Initialize the command string: We are using the double quotes
  // for Windows machines to ensure that if there are any spaces
  // in the path, then the exec call does not split the path:
  let command = `node ${isWin ? `"${l10nBundleBuilder}"` : l10nBundleBuilder}`;

  // Add options to the command string
  if (configuredOptions.length > 0) {
    configuredOptions.forEach((key) => {
      if (translationOptions[key]) {
        // Handle supportedLocales option separately to remove spaces between locale codes
        command += (key === constants.TRANSLATION_OPTIONS.SUPPORTED_LOCALES_KEY) ?
          ` --${key}="${translationOptions[key].replace(/\s+/g, '')}"` :
          ` --${key}="${translationOptions[key]}"`;
      }
    });

    // If locale is not set, then use the default en-US:
    if (!translationOptions.locale) {
      command += '--locale=en-US';
    }
  } else {
    util.log.error('Error while generating the translation command. You are missing required options. Set them up in the oraclejetconfig.json file.');
  }

  return command;
}

/**
 * Retrieves the paths to resources folders for JET components.
 *
 * @returns {array} An array of paths to resources folders.
 */
function _getPathsToResourcesFolders() {
  const pathToComponentsInSrc = util.getComponentsPathInSrc();
  const componentsInFolder = util.getJETComponentsInFolder(pathToComponentsInSrc);
  const pathsToResourcesFolder = [];

  componentsInFolder.forEach((component) => {
    const pathToComponent = path.join(pathToComponentsInSrc, component);
    const pathToComponentJson = path.join(pathToComponent, constants.JET_COMPONENT_JSON);

    let componentJson = {};

    if (fs.existsSync(pathToComponentJson)) {
      componentJson = util.readJsonAndReturnObject(pathToComponentJson);
    }

    if (util.isJETPack({ pack: component, componentJson })) {
      const pathsInPack = _getPathsToResourcesFoldersInPack(component, pathToComponent);
      pathsToResourcesFolder.push(...pathsInPack);
    } else {
      const pathToResourcesFolder = path.join(
        pathToComponent,
        constants.RESOURCES,
        constants.NLS
      );

      if (fs.existsSync(pathToResourcesFolder)) {
        pathsToResourcesFolder.push(pathToResourcesFolder);
      }
    }
  });

  return pathsToResourcesFolder;
}

/**
 * Retrieves the paths to resources folders for components within a JET pack.
 *
 * @param {string} pack - The name of the pack.
 * @param {string} pathToPack - The path to the pack.
 *
 * @returns {array} An array of paths to resources folders.
 */
function _getPathsToResourcesFoldersInPack(pack, pathToPack) {
  const componentsInPack = util.getComponentsInPack({
    packName: pack,
    pathToPack
  });

  const pathsToResourcesFoldersInPack = [];

  componentsInPack.forEach((component) => {
    const pathToResourcesFolder = path.join(
      util.getComponentsPathInSrc(),
      pack,
      component,
      constants.RESOURCES,
      constants.NLS
    );

    if (fs.existsSync(pathToResourcesFolder)) {
      pathsToResourcesFoldersInPack.push(pathToResourcesFolder);
    }
  });

  return pathsToResourcesFoldersInPack;
}

/**
 * Builds ICU translations bundles for all components.
 */
async function _buildICUTranslationsBundlesForAllComponents() {
  const pathsToResourcesFolder = _getPathsToResourcesFolders();

  await _buildTranslationsForMultipleComponents(pathsToResourcesFolder);
}

/**
 * Builds ICU translations bundles for multiple components.
 * @param {string} pathsToResourcesFolder Path to the resources folder.
 */
async function _buildTranslationsForMultipleComponents(pathsToResourcesFolder) {
  // Map over the paths and create a promise for each one
  const promises = pathsToResourcesFolder.map(pathToResourcesFolder =>
    _buildICUTranslationsBundleForComponent(pathToResourcesFolder)
  );

  // Wait for all promises to resolve
  await Promise.all(promises);
}

/**
 * Builds ICU translations bundle for a single component.
 *
 * @param {string} pathToResourcesFolder Path to the resources folder.
 */
async function _buildICUTranslationsBundleForComponent(pathToResourcesFolder) {
  try {
    const { l10nBundleBuilder, translation, configuredOptions } = _getTranslationConfig();

    // Extract the component name from the path, and if the path has
    // back-slashes, then convert them to forward-slashes.
    const match = pathToResourcesFolder.replace(/\\/g, '/').match(/\/([^/]+)\/resources\/nls$/);
    const component = match && match[1];

    let bundleName = `${component}-strings.json`;
    const componentBundleName = translation.options.componentBundleName;
    // Generate the bundle name from the translation.options.componentBundleName
    // property if configured:
    if (componentBundleName) {
      bundleName = componentBundleName;
      // eslint-disable-next-line no-template-curly-in-string
      const hasComponentNameToken = bundleName.includes('${componentName}');

      if (hasComponentNameToken) {
        // eslint-disable-next-line no-template-curly-in-string
        bundleName = `${bundleName.replace('${componentName}', component)}`;
      }

      if (!bundleName.endsWith('.json')) {
        bundleName = `${bundleName}.json`;
      }
    }

    // Construct the bundle file path
    const bundleFile = path.join(pathToResourcesFolder, bundleName);
    // Check if the bundle file exists
    if (fs.existsSync(bundleFile)) {
      // Define the translation options object
      const translationOptions = {
        ...translation.options,
        bundleName,
        rootDir: pathToResourcesFolder,
        outDir: pathToResourcesFolder
      };

      // Generate the ICU translation command
      const command = _generateICUTranslationCommand({
        translationOptions,
        l10nBundleBuilder,
        configuredOptions
      });

      util.log(`Building ICU translations bundle for component ${component}...`);

      // Execute the command
      await _executeTranslationCommand(command);

      util.log(`Built ICU translations bundle for component ${component} successfully`);
    } else {
      util.log.warning(`Skipping building ICU translations bundle for ${component}: the bundle ${bundleName} could not be found.`);
    }
  } catch (error) {
    util.log.error(error.message);
  }
}

/**
 * Builds ICU translations bundles for multiple modified bundle
 * bundle files.
 * @param {Array} modifiedBundleFiles paths to resources folders.
 */
async function _buildICUTranslationsForAllModifiedBundleFiles(modifiedBundleFiles) {
  const { l10nBundleBuilder, translation, configuredOptions } = _getTranslationConfig();

  const promises = modifiedBundleFiles.map(async (modifiedBundleFile) => {
    try {
      // Find the index of 'nls' in the modified bundle file path
      const nlsIndex = modifiedBundleFile.indexOf(constants.NLS);
      const pathToResourcesFolder = nlsIndex !== -1 ?
        modifiedBundleFile.substring(0, nlsIndex + 4) : '';

      // Extract the bundle name from the modified bundle file path
      const lastSlashIndex = modifiedBundleFile.lastIndexOf('/');
      const bundleName = lastSlashIndex !== -1 ? modifiedBundleFile.substring(lastSlashIndex + 1) : '';

      // Define the translation options object
      const translationOptions = {
        ...translation.options,
        bundleName,
        rootDir: pathToResourcesFolder,
        outDir: pathToResourcesFolder
      };

      // Generate the ICU translation command
      const command = _generateICUTranslationCommand({
        translationOptions,
        l10nBundleBuilder,
        configuredOptions
      });

      // Execute the command
      await _executeTranslationCommand(command);

      // Log success message
      util.log(`Built ICU translations bundle for component ${bundleName.replace('-strings.json', '')} successfully`);
    } catch (error) {
      // Log any errors that occur during processing
      util.log.error(error.message);
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);
}

/**
 * Builds ICU translations bundles for components.
 */
function _buildICUTranslationsBundleAtComponentLevel({
  context, modifiedBundleFiles, componentJson }) {
  return new Promise(async (resolve) => {
    if (util.buildICUTranslationsBundle()) {
      if (Array.isArray(modifiedBundleFiles) && modifiedBundleFiles.length > 0) {
        util.log('Building ICU translations for modified bundles.');
        await _buildICUTranslationsForAllModifiedBundleFiles(modifiedBundleFiles);
        util.log('Building ICU translations for modified bundles finished.');
      } else if (componentJson) {
        const componentName = componentJson.name;
        const isPack = util.isJETPack({ pack: componentName, componentJson });
        const pathToComponent = path.join(util.getComponentsPathInSrc(), componentName);

        if (isPack) {
          const pathsToResourcesFolder = _getPathsToResourcesFoldersInPack(componentName,
            pathToComponent);
          await _buildTranslationsForMultipleComponents(pathsToResourcesFolder);
        } else {
          const pathToResourcesFolder = path.join(
            pathToComponent,
            constants.RESOURCES,
            constants.NLS
          );

          await _buildICUTranslationsBundleForComponent(pathToResourcesFolder);
        }
      }
    }

    return resolve(context);
  });
}

/**
 * Builds ICU translations bundles at the app level.
 * @param {Object} context
 */
function _buildICUTranslationsBundleAtAppLevel(context) {
  return new Promise(async (resolve, reject) => {
    if (util.buildICUTranslationsBundle()) {
      try {
        const { l10nBundleBuilder, translation, configuredOptions } = _getTranslationConfig();

        const command = _generateICUTranslationCommand({
          translationOptions: translation.options,
          l10nBundleBuilder,
          configuredOptions
        });

        await _executeTranslationCommand(command);
      } catch (error) {
        util.log.error(error);
        return reject(error);
      }
    }

    return resolve(context);
  });
}

module.exports = {
  buildICUTranslationsBundle: function _buildICUTranslationsBundle(context) {
    return new Promise(async (resolve, reject) => {
      try {
        if (util.buildICUTranslationsBundle()) {
          await _buildICUTranslationsBundleAtAppLevel(context);

          await _buildICUTranslationsBundlesForAllComponents();

          util.log('Building ICU translation bundles finished.');
        }
        return resolve(context);
      } catch (error) {
        util.log.error(error);
        return reject(error);
      }
    });
  },
  buildICUTranslationsBundleAtAppLevel: _buildICUTranslationsBundleAtAppLevel,
  buildICUTranslationsBundleAtComponentLevel: _buildICUTranslationsBundleAtComponentLevel
};
