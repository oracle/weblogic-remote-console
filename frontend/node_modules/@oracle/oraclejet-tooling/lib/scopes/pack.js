#! /usr/bin/env node
/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

/**
 * ## Dependencies
 */
// Node
const fs = require('fs-extra');
const path = require('path');

// Oracle
const build = require('../build');
const CONSTANTS = require('../constants');
const component = require('./component');
const exchangeUtils = require('../utils.exchange');
const util = require('../util');
const generateComponentsCache = require('../buildCommon/generateComponentsCache');

// Module variables
let packDirBlacklist = ['min', 'types'];

/**
 * # Components
 *
 * @public
 */
const pack = module.exports;

/**
 * ## add
 *
 * @public
 * @param {Array} packNames
 * @return {Promise}
 */
pack.add = function (packNames, options) {
  return new Promise((resolve, reject) => {
    exchangeUtils.getExchangeUrl(); // Ensure it is set before creating jet_components dir
    const configPaths = util.getConfiguredPaths();
    util.ensureDir(`./${configPaths.exchangeComponents}`);

    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);

    let i = 0;

    function fn() {
      if (i < packNames.length) {
        const packName = packNames[i];

        exchangeUtils.getComponentMetadata(packName)
          .then((metadata) => { // eslint-disable-line
            return new Promise((res, rej) => {
              if (metadata.type === 'pack' || metadata.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
                const packDependenciesObject = metadata.component.dependencies;

                // Array of serialized component names to be added <component>@[<version>]
                const serializedComponentNames = [];

                // Add pack [with version]
                serializedComponentNames.push(`${packName}`);

                // Add pack's components with versions
                // (When adding pack, we always want specific version of a component)
                Object.keys(packDependenciesObject).forEach((packComponentName) => {
                  serializedComponentNames.push(`${packComponentName}@${packDependenciesObject[packComponentName]}`);
                });

                component.add(serializedComponentNames, Object.assign(options, {
                  _suppressMsgColor: true,
                })).then(() => {
                  res();
                });
              } else {
                rej(`'${packName}' is not a pack.`);
              }
            });
          })
          .then(() => {
            i += 1;
            fn();
          })
          .catch((error) => {
            util.log.error(error, true);
            reject();
          });
      } else {
        util.log.success(`Pack(s) '${packNames}' added.`);
        resolve();
      }
    }
    fn();
  });
};

/**
 * ## create
 *
 * @public
 * @param {string} packName
 * @return {Promise}
 */
pack.create = function (packName, options) {
  try {
    util.ensureParameters(packName, CONSTANTS.API_TASKS.CREATE);

    const configPaths = util.getConfiguredPaths();
    const sourceScriptsFolder = util.getSourceScriptsFolder();
    const jetCompositesDirPath = path.join(
      process.cwd(),
      configPaths.src.common,
      sourceScriptsFolder,
      configPaths.components
    );
    const packDirPath = path.join(jetCompositesDirPath, packName);
    // Check if already exists
    if (fs.existsSync(packDirPath)) {
      util.log.error(`Pack '${packName}' already exits.`);
    } else if (!util.isValidName(packName)) {
      const errorMessage = 'The second segment of the pack name must not start with a digit.';
      util.log.error(errorMessage);
    } else if (options.type === CONSTANTS.PACK_TYPE.MONO_PACK && !util.isTypescriptApplication()) {
      const errorMessage = 'Cannot create a mono-pack in a Javascript application. Please run \'ojet add typescript\' to add Typescript support to your application and then try again.';
      util.log.error(errorMessage);
    } else {
      // Make pack directory
      util.ensureDir(packDirPath);

      // Add pack's component.json
      const packComponentJsonTemplatePath = path.join(__dirname, '../templates/pack', CONSTANTS.JET_COMPONENT_JSON);
      const packComponentJson = util.readJsonAndReturnObject(packComponentJsonTemplatePath);
      packComponentJson.name = packName;
      packComponentJson.jetVersion = `^${util.getJETVersion()}`;
      if (options.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
        packComponentJson.type = CONSTANTS.PACK_TYPE.MONO_PACK;
        packComponentJson.contents = [];
      }
      const filename = path.join(packDirPath, CONSTANTS.JET_COMPONENT_JSON);
      util.writeFileSync(filename, JSON.stringify(packComponentJson, null, 2));
      // Add path mapping for pack in tsconfig.json if in typescript app
      util.addComponentToTsconfigPathMapping({
        component: packName,
        isLocal: true
      });
      util.log.success(`Pack '${packName}' successfully created.`);
    }
    return Promise.resolve();
  } catch (error) {
    util.log.error(error, true);
    return Promise.reject(error);
  }
};

/**
 * ## list
 * Lists installed packs
 *
 * @public
 * @return {Promise}
 */
pack.list = function () {
  try {
    const configPaths = util.getConfiguredPaths();
    // Read packs from the config file
    const packsInConfigFile = [];
    const configObj = util.getOraclejetConfigJson();
    if (!util.isObjectEmpty(configObj.components)) {
      Object.keys(configObj.components).forEach((comp) => {
        if (typeof configObj.components[comp] === 'object') {
          packsInConfigFile.push(`${comp}`);
        }
      });
    }

    // Read packs by directories
    const packsByFolder = [];
    const componentsDirPath = configPaths.exchangeComponents;
    if (fs.existsSync(componentsDirPath)) {
      const folderNames = util.getDirectories(componentsDirPath);

      folderNames.forEach((folderName) => {
        const componentJson = util.readJsonAndReturnObject(`${componentsDirPath}/${folderName}/${CONSTANTS.JET_COMPONENT_JSON}`);

        if (componentJson.type === 'pack' || componentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
          packsByFolder.push(folderName);
        }
      });
    }

    if (packsByFolder.length === 0 && packsInConfigFile.length === 0) {
      util.log.success('No components found.');
    }

    util.printList(packsInConfigFile, packsByFolder);
    util.log.success('Packs listed.');
    return Promise.resolve();
  } catch (error) {
    util.log.error(error, true);
    return Promise.reject(error);
  }
};

/**
 * ## package
 *
 * @public
 * @param {array} packNames
 * @param {Object} [options]
 * @return {Promise}
 */
pack.package = function (packNames, options) {
  return new Promise((resolve) => {
    util.ensureParameters(packNames, CONSTANTS.API_TASKS.PUBLISH);

    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);

    const opts = options || {};

    // We allow packaging of only a single pack
    // User can script a loop if he wants to package multiple packs
    const packName = packNames[0];

    // Get path to pack
    const configPaths = util.getConfiguredPaths();
    const packPath = util.getComponentPath({ component: packName });
    const packComponentJsonPath = path.join(packPath, CONSTANTS.JET_COMPONENT_JSON);
    const packComponentJson = util.readJsonAndReturnObject(packComponentJsonPath);
    const packVersion = packComponentJson.version;

    // Get path to built pack
    const packWebDirPath = _getPackWebDirPath(options, configPaths, packName, packVersion);

    let existsInWebDir = fs.existsSync(packWebDirPath);

    // Should we build pack or can we skip that initial step?
    let builtPackPath = '';
    if (existsInWebDir) {
      builtPackPath = packWebDirPath;
    }
    const hadBeenBuiltBefore = !!builtPackPath;

    // Available pack components names for packaging
    const builtPackComponentNamesAndVersions = [];
    const builtPackComponentNames = [];
    let builtPackDirs = []; // Directories that are part of a pack, but are not its components.

    function readBuiltPackComponents() {
      // Read dependencies from the componentCache.
      // Note that the component cache tolerates missing .tsx directives
      opts.stagingPath = configPaths.staging.stagingPath;
      const context = { opts };
      const componentsCache = generateComponentsCache({ context });
      const builtPackComponentJson = componentsCache[packName].componentJson;
      if (packComponentJson.type !== CONSTANTS.PACK_TYPE.MONO_PACK) {
        Object.keys(builtPackComponentJson.dependencies).forEach((packComponentName) => {
          // Remove pack name from the full component name
          const shortComponentName = packComponentName.replace(`${packName}-`, '');
          const builtPackComponentComponentJsonPath = path.join(
            builtPackPath,
            shortComponentName,
            CONSTANTS.JET_COMPONENT_JSON
          );
          if (fs.existsSync(builtPackComponentComponentJsonPath)) {
            builtPackComponentNames.push(shortComponentName);
            builtPackComponentNamesAndVersions.push({
              [shortComponentName]:
              util.readJsonAndReturnObject(builtPackComponentComponentJsonPath).version
            });
          } else {
            util.log(`Pack component\'s descriptor ${builtPackComponentComponentJsonPath}' not found. This component won't be published. Skipping.`); // eslint-disable-line
          }
        });
      }

      builtPackDirs = util.getDirectories(builtPackPath);
      // If the pack is mono-pack, do not filter the min and types folders,
      // which are listed in the packDirBlacklist:
      if (packComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
        packDirBlacklist = [];
      }
      // Save pack directories (not components, types or min folder)
      builtPackDirs = builtPackDirs.filter((packDir) => { // eslint-disable-line
        return builtPackComponentNames.indexOf(packDir) === -1 &&
          packDirBlacklist.indexOf(packDir) === -1;
      });
    }

    function packageBuiltPackComponents() {
      return new Promise((res, rej) => {
        let i = 0;
        function fn() { // eslint-disable-line
          if (i < builtPackComponentNames.length) {
            component.package([builtPackComponentNames[i]], Object.assign(opts, {
              pack: packName
            }))
              .then(() => {
                i += 1;
                fn();
              })
              .catch((error) => {
                rej(error);
              });
          } else {
            res();
          }
        }
        fn();
      });
    }

    // If packing only a pack without dependencies using package component <packName>
    // return just resolved Promise. In a context of a mono-pack, though, it should fail.
    const packageBuiltComponents = opts._excludeDependencies ?
      () => {
        if (packComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
          util.log.error('Packaging or publishing a mono-pack without its contents is not allowed. Package or publish the entire pack instead by using the ojet package pack or ojet publish pack command.');
        }

        return Promise.resolve();
      }
      : packageBuiltPackComponents;

    // Should we build component or can we skip that initial step?
    let initialPromise;
    if (hadBeenBuiltBefore) {
      initialPromise = Promise.resolve();
    } else {
      opts.buildType = 'release';
      // For packs, we would want to build the component, where we get
      // generated docs folder. This folder need to be packaged as well.
      if (packComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK || packComponentJson.type === 'pack') {
        opts.component = packName;
      }
      initialPromise = build('web', opts);
    }

    initialPromise
      .then(() => {
        if (!hadBeenBuiltBefore) {
          // Pack hasn't been built before triggering 'ojet package pack ...'
          // Hence we build the component in previous promise
          // Now it is built. We need to get path again to replace empty string with existing path
          existsInWebDir = fs.existsSync(packWebDirPath);

          builtPackPath = packWebDirPath;
        }
      })
      .then(() => { // eslint-disable-line
        // Do not log info 'Archiving pack was archived' in case we are packaging
        // only pack itself as a standalone component (without dependencies)
        // Case: ojet package component <pack_name>
        if (!opts._excludeDependencies) {
          util.log(`Archiving pack '${packName}'.`);
        }
        return readBuiltPackComponents();
      })
      .then(() => { // eslint-disable-line
        return packageBuiltComponents();
      })
      .then(() => {
        // Package pack
        if (opts.pack) { delete opts.pack; }

        // Create an array of vcomponent json files used to generate
        // the components' JsDocs folder (/docs) in web.
        const componentDocsJsonArray = [];
        const vComponents = util.getVComponentsInJETPack({ pack: packName });
        vComponents.forEach((vComponent) => {
          componentDocsJsonArray.push(util.getComponentJsDocsJsonFile(vComponent));
        });

        return component.package([packName], Object.assign(opts, {
          _contentToArchive: {
            dirs: builtPackDirs,
            // Filter all json files used to generate /docs for vcomponents in
            // the pack: These artefacts are not to be packaged in the zip.
            files: util.getFiles(builtPackPath).filter(
              file => !componentDocsJsonArray.includes(`${file}`)
            ),
            minFiles: util.getFiles(path.join(builtPackPath, 'min'))
          }
        }));
      })
      .then(() => {
        if (!opts._excludeDependencies) {
          // Do not log info 'Archiving pack was archived' in case we are packaging
          // only pack itself as a standalone component (without dependencies)
          // Case: ojet package component <pack_name>
          util.log(`Pack '${packName}' was archived.`);
        }
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};

/**
 * ## publish
 *
 * @public
 * @param {string} packName
 * @param {Object} [options]
 * @return {Promise}
 */
pack.publish = function (packName, options) {
  return new Promise((resolve) => {
    util.ensureParameters(packName, CONSTANTS.API_TASKS.PUBLISH);

    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);

    const opts = options || {};

    const packPath = util.getComponentPath({ component: packName });
    const packComponentJsonPath = path.join(packPath, CONSTANTS.JET_COMPONENT_JSON);
    const packComponentJson = util.readJsonAndReturnObject(packComponentJsonPath);
    const packVersion = packComponentJson.version;

    // Get path to built pack
    const configPaths = util.getConfiguredPaths();
    const packWebDirPath = _getPackWebDirPath(options, configPaths, packName, packVersion);

    let existsInWebDir = fs.existsSync(packWebDirPath);

    // Should we build pack or can we skip that initial step?
    let builtPackPath = '';
    if (existsInWebDir) {
      builtPackPath = packWebDirPath;
    }
    const hadBeenBuiltBefore = !!builtPackPath;

    // Should we build component or can we skip that initial step?
    const initalPromise = hadBeenBuiltBefore ? Promise.resolve() : build('web', {
      sassCompile: true,
      pcssCompile: true
    });

    return initalPromise
      .then(() => {
        if (!hadBeenBuiltBefore) {
          // Pack hasn't been built before triggering 'ojet package pack ...'
          // Hence we build the component in previous promise
          // Now it is built. We need to get path again to replace empty string with existing path
          existsInWebDir = fs.existsSync(packWebDirPath);

          builtPackPath = packWebDirPath;
        }
      })
      .then(() => { // eslint-disable-line
        // Always clear 'temp' directory before publishing
        if (fs.existsSync(CONSTANTS.PUBLISH_TEMP_DIRECTORY)) {
          fs.emptyDirSync(CONSTANTS.PUBLISH_TEMP_DIRECTORY);
        }
        // Use 'ojet package' to prepare files
        // Put files into 'temp' directory instead 'dist' as they'll be deleted after published
        return this.package([packName], Object.assign(opts, {
          _useTempDir: true,
        }));
      })
      .then(() => util.loginIfCredentialsProvided())
      .then(() => {
        util.log(`Publishing pack '${packName}'.`);
        return exchangeUtils.uploadToExchange(packName, Object.assign(opts, {
          _batchUpload: true,
        }));
      })
      .then(() => {
        util.log.success(`Pack '${packName}' was published.`);
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};

/**
 * ## remove
 *
 * @public
 * @param {Array} packNames
 * @param {Object} [options]
 * @return {Promise}
 */
pack.remove = function (packNames, options) {
  return new Promise((resolve, reject) => {
    let i = 0;

    function fn() {
      if (i < packNames.length) {
        const configPaths = util.getConfiguredPaths();
        const packName = packNames[i];
        const packPath = `${configPaths.exchangeComponents}/${packName}`;

        if (fs.existsSync(packPath)) {
          const packComponentNames = [];
          const packDirs = util.getDirectories(packPath);

          packDirs.forEach((packDir) => {
            const packComponentComponentJsonPath =
              path.join(packPath, packDir, CONSTANTS.JET_COMPONENT_JSON);
            if (fs.existsSync(packComponentComponentJsonPath)) {
              const packComponentComponentJson =
                util.readJsonAndReturnObject(packComponentComponentJsonPath);
              packComponentNames.push(`${packComponentComponentJson.pack}-${packComponentComponentJson.name}@${packComponentComponentJson.version}`);
            }
          });

          component.remove(packComponentNames, null, Object.assign(options, {
            _suppressMsgColor: true,
          }))
            .then(() => {
              i += 1;
              fn();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          util.log.error(`Pack '${packName}' not found.`);
          i += 1;
          fn();
        }
      } else {
        util.log.success(`Pack(s) '${packNames}' removed.`);
        resolve();
      }
    }
    fn();
  });
};

/**
 * ## _getPackWebDirPath
 *
 * Generates the path to the web dir
 *
 * @param {Object} [options]
 * @param {Object} configPaths
 * @param {String} packName
 * @param {String} packVersion
 * @return {String}
 */
function _getPackWebDirPath(options, configPaths, packName, packVersion) {
  const versionedPackWebDirPath = path.join(
    configPaths.staging.web,
    configPaths.src.javascript,
    configPaths.components,
    packName,
    packVersion
  );

  const unVersionedPackWebDirPath = path.join(
    configPaths.staging.web,
    configPaths.src.javascript,
    configPaths.components,
    packName
  );
  // Paths to component json files for the pack, which are used to ensure that not only
  // the defined paths exist but they are (depending on the required structure) of the
  // pack to be packaged.
  const componentJsonInNonVersionedPath = path.join(
    unVersionedPackWebDirPath,
    'component.json'
  );

  const componentJsonInVersionedPath = path.join(
    versionedPackWebDirPath,
    'component.json'
  );
  let packWebDirPath;

  // When packaging a pack, there are two possible scenarios: the pack is already built
  // or otherwise. For an already built pack, depending on the folder structure needed
  // and the need to not invoke another build process, we can check for an existing vers-
  // ioned structure, if the versioned-less one is required, before copying its contents
  // to the generated version-less path and delete the versioned path. In this case, the
  // vice-versa is also true. For the case when the pack is not already built, then we j-
  // ust check the needed structure to determine the path. Let's assume an already built
  // project exists:
  if (util.useUnversionedStructure({ options })) {
    if (fs.existsSync(componentJsonInVersionedPath)) {
      // Versioned path includes the version-less path; we can copy its contents there.
      fs.copySync(versionedPackWebDirPath, unVersionedPackWebDirPath);
      // Remove the versioned path only after ensuring that its contents are successfully
      // copied into the version-less path.
      if (fs.existsSync(componentJsonInNonVersionedPath)) {
        fs.removeSync(versionedPackWebDirPath);
        packWebDirPath = unVersionedPackWebDirPath;
      }
    } else if (fs.existsSync(componentJsonInNonVersionedPath)) {
      // The required structure already exists due to the previous build; so, just direct
      // the packaging process to package the pack from there.
      packWebDirPath = unVersionedPackWebDirPath;
    }
  } else {
    // Create a temporary folder that we can copy the contents of version-less path into.
    // We need the temporary folder because the version-less path includes the versioned
    // one, so deleting it deletes the versioned path as well.
    const tempFolder = path.join(configPaths.staging.web, configPaths.src.javascript, 'temp-jet-composites');
    if (fs.existsSync(componentJsonInNonVersionedPath)) {
      if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
      }
      // Copy the contents of version-less folder and then delete its path.
      fs.copySync(unVersionedPackWebDirPath, tempFolder);
      fs.removeSync(unVersionedPackWebDirPath);
      // Copy the contents of the tempoarary folder and then deletes its path.
      fs.copySync(tempFolder, versionedPackWebDirPath);
      fs.removeSync(tempFolder);
      // Check that the versioned path exists before assigning the path.
      if (fs.existsSync(componentJsonInVersionedPath)) {
        packWebDirPath = versionedPackWebDirPath;
      }
    } else if (fs.existsSync(componentJsonInVersionedPath)) {
      packWebDirPath = versionedPackWebDirPath;
    }
  }

  // For the case when the pack is not built already, then just check the required structure
  // and then assign the path accordingly.
  if (!packWebDirPath) {
    packWebDirPath = util.useUnversionedStructure({ options }) ?
      unVersionedPackWebDirPath : versionedPackWebDirPath;
  }

  return packWebDirPath;
}
