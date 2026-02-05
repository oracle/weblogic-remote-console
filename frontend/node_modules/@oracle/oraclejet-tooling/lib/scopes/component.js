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

// 3rd party
const archiver = require('archiver');
const extract = require('extract-zip');
const glob = require('glob');

// Oracle
const build = require('../build');
const CONSTANTS = require('../constants');
const exchangeUtils = require('../utils.exchange');
const packLib = require('./pack'); // 'const pack =' has been already used elsewhere, hence packLib
const util = require('../util');
const hookRunner = require('../hookRunner');

const measurementsMap = {
  fetchComponent: 0,
  unpackArchive: 0,
  installReferences: 0
};

/**
 * # Components
 *
 * @public
 */
const component = module.exports;

/**
 * ## add
 *
 * @public
 * @param {Array} componentNames
 * @param {Object} options
 */
component.add = function (componentNames, options) {
  return new Promise((resolve) => {
    exchangeUtils.getExchangeUrl(); // Ensure it is set before creating jet_components dir
    const configPaths = util.getConfiguredPaths();
    util.ensureDir(`./${configPaths.exchangeComponents}`);

    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);

    util.loginIfCredentialsProvided()
      .then(() => { // eslint-disable-line
        return exchangeUtils.resolve('add', componentNames, options);
      })
      .then(result => _executeSolutions(result, options))
      .then(() => {
        util.log.success(`Component(s) '${componentNames}' added.`, options);
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};

function _executeSolutions(resolutionServiceResponse, options) {
  return new Promise((resolve, reject) => {
    if (resolutionServiceResponse.solutions.length === 0) {
      if (resolutionServiceResponse.message) {
        reject(resolutionServiceResponse.message);
      } else {
        reject('Sorry, your request could not be resolved.');
      }
    } else {
      util.log('Updating project components.');
      _applyEnvironmentChangesRemove(resolutionServiceResponse.solutions[0])
        .then((solution) => { // eslint-disable-line
          return _applyEnvironmentChangesAddOrUpdate(solution, 'add', options);
        })
        .then((solution) => { // eslint-disable-line
          return _applyEnvironmentChangesAddOrUpdate(solution, 'update', options);
        })
        .then(_applyConfigChanges)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

function _applyEnvironmentChangesRemove(solution) {
  return new Promise((resolve) => {
    const changes = solution.environmentChanges;
    const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
    if (util.hasProperty(changes, 'remove')) {
      const rmChanges = changes.remove;
      let counter = 0;
      Object.keys(rmChanges).forEach((comp) => {
        const componentDirPath = path.join(componentsDirPath, comp);

        if (typeof rmChanges[comp] === 'string') {
          // Component
          if (fs.existsSync(componentDirPath)) {
            if (fs.existsSync(path.join(componentDirPath, 'types'))) {
              util.removeComponentFromTsconfigPathMapping({ component: comp });
            }
            util.deleteDirSync(componentDirPath);
            counter += 1;
          } else {
            util.log.warning(`Component '${comp}' not found. Skipping.`);
          }
        } else if (typeof rmChanges[comp] === 'object') {
          // Pack
          Object.keys(rmChanges[comp].components).forEach((packComp) => {
            const packComponentDirPath = path.join(componentsDirPath, comp, packComp);

            if (fs.existsSync(packComponentDirPath)) {
              util.deleteDirSync(packComponentDirPath);
              counter += 1;
            } else {
              util.log.warning(`Component '${comp}/${packComp}' not found. Skipping.`);
            }
          });

          // If pack remains empty, delete it
          const packDirs = util.getDirectories(componentDirPath);

          // Find index of the first component
          const index = packDirs.findIndex((dir) => { // eslint-disable-line
            return fs.existsSync(path.join(componentDirPath, dir, CONSTANTS.JET_COMPONENT_JSON));
          });

          // Delete pack
          if (index === -1) {
            if (fs.existsSync(path.join(componentDirPath, 'types'))) {
              util.removeComponentFromTsconfigPathMapping({ component: comp });
            }
            util.log(`Pack '${comp}' removed as it remained empty.`);
            util.deleteDirSync(componentDirPath);
          }
        }
      });
      util.log(`${counter} component(s) removed from project.`);
      resolve(solution);
    } else {
      resolve(solution);
    }
  });
}

function _applyEnvironmentChangesAddOrUpdate(solution, type, options) {
  return new Promise((resolve, reject) => {
    const changes = solution.environmentChanges;
    const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
    if (util.hasProperty(changes, type)) {
      const componentDescriptors = [];
      const envChanges = changes[type];
      let counter = 0;
      Object.keys(envChanges).forEach((comp) => {
        if (typeof envChanges[comp] === 'string') {
          // Component
          componentDescriptors.push({
            fullName: comp,
            name: comp,
            version: envChanges[comp]
          });
          counter += 1;
        } else if (typeof envChanges[comp] === 'object') {
          // Pack
          // 1. Add pack itself
          const packDirPath = path.join(componentsDirPath, comp);
          if (fs.existsSync(packDirPath) && type === 'add') {
            // Already exists, add only if versions differ
            const packComponentJsonPath = path.join(packDirPath, CONSTANTS.JET_COMPONENT_JSON);
            const packComponentJson = util.readJsonAndReturnObject(packComponentJsonPath);
            if (packComponentJson.version !== envChanges[comp].version) {
              componentDescriptors.push({
                fullName: comp,
                name: comp,
                version: envChanges[comp].version,
                type: packComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK ? CONSTANTS.PACK_TYPE.MONO_PACK : 'pack'
              });
            } else {
              util.log(`Pack ${comp} already installed. Skipping.`);
            }
          } else {
            // Does not exits yet || Update
            componentDescriptors.push({
              fullName: comp,
              name: comp,
              version: envChanges[comp].version,
              type: 'pack'
            });
          }

          // 2. Add pack components
          Object.keys(envChanges[comp].components).forEach((packComp) => {
            componentDescriptors.push({
              fullName: `${comp}-${packComp}`,
              name: packComp,
              version: envChanges[comp].components[packComp],
              pack: comp
            });
            counter += 1;
          });
        }
      });
      _installComponents(componentDescriptors, options)
        .then(() => {
          if (componentDescriptors.length > 0) {
            util.log(`${counter} component(s) added to project.`);
          }
          util.log(`Fetching components took ${util.formatSeconds(measurementsMap.fetchComponent)}.`);
          util.log(`Unpacking archives took ${util.formatSeconds(measurementsMap.unpackArchive)}.`);
          util.log(`Installing reference components took ${util.formatSeconds(measurementsMap.installReferences)}.`);
        })
        .then(() => {
          resolve(solution);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      resolve(solution);
    }
  });
}

function _applyConfigChanges(solution) {
  return new Promise((resolve) => {
    util.log('Applying changes to configuration file.');
    const configObj = util.getOraclejetConfigJson();
    let components = configObj.components || {};
    const changes = solution.configChanges;

    // Remove
    if (util.hasProperty(changes, 'remove')) {
      const rmChanges = changes.remove;
      Object.keys(rmChanges).forEach((comp) => {
        if (typeof rmChanges[comp] === 'string') {
          // Component
          delete components[comp];
        } else if (typeof rmChanges[comp] === 'object') {
          // Pack
          Object.keys(rmChanges[comp].components).forEach((packComp) => {
            // Condition not to let it crash if user config.json is missing the component
            const cmp = components[comp];
            if (cmp && cmp.components && cmp.components[packComp]) {
              delete components[comp].components[packComp];
            }
          });

          // If pack remains empty, delete it
          if (util.isObjectEmpty(components[comp].components)) {
            delete components[comp];
          }
        }
      });
    }

    // Add
    if (util.hasProperty(changes, 'add')) {
      components = _mergeChanges(components, changes.add);
    }

    // Update
    if (util.hasProperty(changes, 'update')) {
      components = _mergeChanges(components, changes.update);
    }

    // We must reassign as it could be initialised an empty object
    configObj.components = components;
    util.writeFileSync(`./${CONSTANTS.ORACLE_JET_CONFIG_JSON}`, JSON.stringify(configObj, null, 2));
    util.log('Changes to configuration file applied.');
    resolve();
  });
}

function _mergeChanges(components, changes) {
  const mergedComponents = components;

  Object.keys(changes).forEach((comp) => {
    if (typeof changes[comp] === 'string') {
      // Component
      Object.assign(mergedComponents, { [comp]: changes[comp] });
    } else if (typeof changes[comp] === 'object') {
      // Pack
      const pack = mergedComponents[comp] || {};
      // Merge pack components
      pack.components = pack.components || {};
      Object.assign(pack.components, changes[comp].components);
      // Merge version
      pack.version = changes[comp].version;

      // Merge pack
      mergedComponents[comp] = pack;
    }
  });
  return mergedComponents;
}

/**
 * ## _installComponents
 *
 * @public
 * @param {Array} componentDescriptors
 * @param {Object} options
 * @returns {Promise}
 */
function _installComponents(componentDescriptors, options) {
  const profiler = util.profilerFactory(measurementsMap);

  return new Promise((resolve, reject) => {
    let i = 0;

    function fn() {
      if (i < componentDescriptors.length) {
        const componentMetadata = componentDescriptors[i];

        profiler.profile(_fetchArchive, componentMetadata, 'fetchComponent')
          .then(compMetadata2 => profiler.profile(_unpackArchive, compMetadata2, 'unpackArchive'))
          .then(_enhanceComponentMetadata)
          .then(compMetadata3 => profiler.profile(_installReferenceComponent, { metadata: compMetadata3, options }, 'installReferences'))
          .then(_shufflePackComponentResources)
          .then(_addToTsconfigPathMapping)
          .then(() => {
            i += 1;
            fn();
          })
          .catch((error) => {
            profiler.disconnect();
            reject(error);
          });
      } else {
        profiler.disconnect();
        resolve();
      }
    }
    fn();
  });
}

/**
 * ## _fetchArchive
 *
 * @private
 * @param {Object} componentMetadata
 * @returns {Promise}
 */
function _fetchArchive(componentMetadata) {
  const metadata = componentMetadata;
  const codeUrl = `/components/${metadata.fullName}/versions/${metadata.version}/download`;
  const componentName = `${metadata.fullName}@${metadata.version}`;

  return new Promise(async (resolve, reject) => {
    util.log(`Fetching '${componentName}' bits from Exchange.`);
    util.requestWithRetry(3, metadata, {
      path: codeUrl
    })
      .then((responseData) => {
        const response = responseData.response;
        return exchangeUtils.validateAuthenticationOfRequest(
          response,
          () => { return _fetchArchive(componentMetadata); }, // eslint-disable-line
          () => { // eslint-disable-line
            util.checkForHttpErrors(response, responseData.responseBody);

            util.writeFileSync(`./${componentName}.zip`, Buffer.concat(responseData.buffer));
            return metadata;
          }
        );
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * ## _getComponentDirPath
 *
 * @private
 * @param {Object} componentMetadata
 * @returns {String}
 */
function _getComponentDirPath(componentMetadata) {
  const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
  const componentName = componentMetadata.name;

  if (componentMetadata.pack) {
    return path.join(componentsDirPath, componentMetadata.pack, componentName);
  }
  return path.join(componentsDirPath, componentName);
}

/**
 * ## _unpackArchive
 *
 * @private
 * @param {Object} componentMetadata
 * @returns {Promise}
 */
function _unpackArchive(componentMetadata) {
  const componentDirPath = _getComponentDirPath(componentMetadata);
  const componentName = `${componentMetadata.fullName}@${componentMetadata.version}`;
  return new Promise((resolve, reject) => {
    // When updating, delete the original one
    if (fs.existsSync(componentDirPath)) {
      if (componentMetadata.type !== 'pack' && componentMetadata.type !== CONSTANTS.PACK_TYPE.MONO_PACK) {
        // 1. Component, just delete dir
        util.deleteDirSync(componentDirPath);
      } else {
        // 2. Pack, delete all files and folders without component.json inside
        // Files
        util.getFiles(componentDirPath).forEach((file) => {
          util.deleteFileSync(path.join(componentDirPath, file));
        });

        // Directories
        util.getDirectories(componentDirPath).forEach((dir) => {
          if (!fs.existsSync(path.join(componentDirPath, dir, CONSTANTS.JET_COMPONENT_JSON))) {
            util.deleteDirSync(path.join(componentDirPath, dir));
          }
        });
      }
    }

    util.log(`Unpacking '${componentName}' archive.`);
    const zipFileName = `${componentName}.zip`;

    extract(zipFileName, {
      dir: path.join(process.cwd(), componentDirPath)
    }, async (error) => {
      if (error) {
        reject(error);
      }
      try {
        util.deleteFileSync(zipFileName, true);
      } catch (delErr) {
        // Ugly, but can fix up a bad deletion timing on Windows
        await new Promise(res => setTimeout(res, 2000));
        try {
          util.deleteFileSync(zipFileName, true);
        } catch (err) {
          util.log(`Problem deleting ${zipFileName}`);
        }
      }
      util.log(`Component '${componentName}' archive was successfully unpacked and installed.`);
      resolve(componentMetadata);
    });
  });
}

/**
 * ## _enhanceComponentMetadata
 *
 * @private
 * @param {Object} componentMetadata
 * @returns {Promise}
 */
function _enhanceComponentMetadata(componentMetadata) {
  return new Promise((resolve) => {
    const componentDirPath = _getComponentDirPath(componentMetadata);
    const componentJson = util.readJsonAndReturnObject(
      path.join(componentDirPath, CONSTANTS.JET_COMPONENT_JSON));
    if (componentJson) {
      const tempComp = {};
      // eslint-disable-next-line no-param-reassign
      componentMetadata.type = componentJson.type;
      // eslint-disable-next-line no-param-reassign
      componentMetadata.dependencyScope = componentJson.dependencyScope;
      if (componentJson.type === CONSTANTS.COMPONENT_TYPE.REFERENCE) {
        tempComp.package = componentJson.package;
        tempComp.version = componentJson.version;
      }
      componentMetadata.component = tempComp; // eslint-disable-line no-param-reassign
    }
    resolve(componentMetadata);
  });
}

/**
 * ## _installReferenceComponent
 *
 * @private
 * @param {Object} obj: componentMetadata, options
 * @returns {Promise}
 */
function _installReferenceComponent(obj) {
  return new Promise((resolve, reject) => {
    const componentMetadata = obj.metadata;
    const options = obj.options;
    const isAllowedDependencyScope = componentMetadata.dependencyScope === 'installable' || componentMetadata.dependencyScope === undefined;
    if (componentMetadata.type === CONSTANTS.COMPONENT_TYPE.REFERENCE && isAllowedDependencyScope) {
      // Call npm install <componentName>
      const npmPackageName = componentMetadata.component.package;
      const npmPackageVersion = componentMetadata.component.version;
      const npmPackage = `${npmPackageName}@${npmPackageVersion}`;
      const installer = util.getInstallerCommand({ options });

      util.log(`Installing npm package '${npmPackage}' referenced by '${componentMetadata.fullName}.'`);

      const { enableLegacyPeerDeps } = util.getOraclejetConfigJson();
      const installFlags = [];

      if (enableLegacyPeerDeps && installer.installer === 'npm') {
        installFlags.push(installer.flags.legacy);
      }

      util.spawn(installer.installer, [installer.verbs.install, npmPackage, ...installFlags])
        .then(() => {
          util.log(`Npm package '${npmPackage}' was successfully installed.`);
          // Add the referenced component into the tsconfig file:
          util.addComponentToTsconfigPathMapping({
            component: componentMetadata.fullName,
            isLocal: false
          });
          resolve(componentMetadata);
        })
        .catch((error) => {
          // Clean up failed install
          const componentDirPath = _getComponentDirPath(componentMetadata);
          util.deleteDirSync(componentDirPath);
          reject(error);
        });
    } else {
      // Continue doing nothing
      resolve(componentMetadata);
    }
  });
}

/**
 * ## _addToTsconfigPathMapping
 *
 * @private
 * @param {Object} componentMetadata
 * @returns {Promise}
 */
function _addToTsconfigPathMapping(componentMetadata) {
  return new Promise((resolve) => {
    const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
    const componentName = componentMetadata.pack || componentMetadata.name;
    const typesDirPath = path.join(
      componentsDirPath,
      componentName,
      'types'
    );
    if (util.fsExistsSync(typesDirPath)) {
      util.addComponentToTsconfigPathMapping({
        component: componentName,
        isLocal: false
      });
    }
    resolve(componentMetadata);
  });
}

/**
 * ## _shufflePackComponentResources
 *
 * Move pack component's min and types folders (if they exist) to
 * <pack>/min and <pack>/types respectively to meet tooling requirements.
 * The packaging / publishing process no longer includes the min and types folders at the
 * pack level due to issues in vb
 * @param {object} componentMetadata
 * @returns {Promise}
 */
function _shufflePackComponentResources(componentMetadata) {
  return new Promise((resolve) => {
    const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
    const { pack: componentPack, name: componentName, type } = componentMetadata;
    if (componentPack) {
      // if component belongs to a pack and has a /min folder,
      // move the folder from <pack>/<component>/min to <pack>/min/<component>
      const pathToPack = path.join(componentsDirPath, componentPack);
      const pathToPackComponentMinFolder = path.join(pathToPack, componentName, 'min');
      if (util.fsExistsSync(pathToPackComponentMinFolder)) {
        try {
          fs.moveSync(pathToPackComponentMinFolder, path.join(pathToPack, 'min', componentName));
        } catch (e) {
          // node often errors on the first try
          (async () => {
            await new Promise(res => setTimeout(res, 2000));
            if (util.fsExistsSync(pathToPackComponentMinFolder)) {
              fs.moveSync(pathToPackComponentMinFolder, path.join(pathToPack, 'min', componentName));
            }
          })();
        }
      }
    }
    if (type !== 'pack' && type !== CONSTANTS.PACK_TYPE.MONO_PACK) {
      // find all *.d.ts files in the none-pack component and move them to
      // <pack>/types/<component> if the component is in a pack and
      // <component>/types if the component is a singleton
      _moveDtsFiles({ componentPack, componentName });
    }
    resolve(componentMetadata);
  });
}

/**
 * ## _moveDtFiles
 *
 * Find all *.d.ts files in a component and move them to <pack>/types/<component> if
 * the component is in a pack and <component>/types if the component
 * is a singleton. This is needed because not all components aggregate
 * their type definition files in the single location ("types" folder)
 * expected by the tooling
 * @param {object} options
 * @param {string} options.componentPack
 * @param {string} options.componentName
 * @returns {void}
 */
function _moveDtsFiles({ componentPack = '', componentName }) {
  const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
  if (componentPack) {
    // component is inside a pack
    const componentPackRoot = path.join(componentsDirPath, componentPack);
    const componentRoot = path.join(componentPackRoot, componentName);
    const componentPackTypesFolder = path.join(componentPackRoot, 'types', componentName);
    const componentTypesFolder = path.join(componentRoot, 'types');
    if (util.fsExistsSync(componentTypesFolder) &&
      util.isDirectory(componentTypesFolder)) {
      // <pack>/component>/types found, move all *.d.ts in it to
      // <pack>/types/<component>
      glob.sync('**/*.d.ts', { cwd: componentTypesFolder })
        .forEach((dtsFile) => {
          fs.moveSync(
            path.join(componentTypesFolder, dtsFile),
            path.join(componentPackTypesFolder, dtsFile)
          );
        });
      // if <pack>/<component>/types is empty due to move, delete
      if (!fs.readdirSync(componentTypesFolder).length) {
        fs.removeSync(componentTypesFolder);
      }
    }
    // look for *.d.ts files outside <pack>/<component>/types and copy them to
    // <pack>/types/<component> if an equivalent file is not already present
    try {
      glob.sync('**/*.d.ts', { cwd: componentRoot })
        .forEach((dtsFile) => {
          const dtsFileTypesFolderPath = path.join(componentPackTypesFolder, dtsFile);
          if (!fs.existsSync(dtsFileTypesFolderPath)) {
            fs.moveSync(
              path.join(componentRoot, dtsFile),
              dtsFileTypesFolderPath
            );
          }
        });
    } catch (globErr) {
      // Sometimes this fails, esp. on Windows--move on
    }
  } else {
    // component is a singleton
    const componentRoot = path.join(componentsDirPath, componentName);
    const componentTypesFolder = path.join(componentRoot, 'types');
    // look for *.d.ts files outside <component>/types and copy them to
    // <component>/types if an equivalent file is not already present
    glob.sync('**/*.d.ts', { cwd: componentRoot })
      .forEach((dtsFile) => {
        let dtsFileTypesFolderPath = path.join(componentTypesFolder, dtsFile);
        // Fixup for issue where name already has types/ in the path
        dtsFileTypesFolderPath = dtsFileTypesFolderPath.replace(path.join('types', 'types'), 'types');
        if (!fs.existsSync(dtsFileTypesFolderPath)) {
          fs.moveSync(
            path.join(componentRoot, dtsFile),
            dtsFileTypesFolderPath
          );
        }
      });
  }
}

/**
 * ## list
 * Lists installed components
 *
 * @private
 */
component.list = function () {
  return new Promise((resolve) => {
    const componentsDirPath = util.getConfiguredPaths().exchangeComponents;
    // Read components from the config file
    const componentsInConfigFile = [];
    const configObj = util.getOraclejetConfigJson();
    if (!util.isObjectEmpty(configObj.components)) {
      Object.keys(configObj.components).forEach((comp) => {
        if (typeof configObj.components[comp] === 'object') {
          // Pack
          Object.keys(configObj.components[comp].components).forEach((packComponent) => {
            componentsInConfigFile.push(`${comp}-${packComponent}`);
          });
        } else {
          componentsInConfigFile.push(comp);
        }
      });
    }

    // Read components by directories
    const componentsByFolder = [];
    if (fs.existsSync(componentsDirPath)) {
      const folderNames = util.getDirectories(componentsDirPath);

      folderNames.forEach((folder) => {
        const componentJson = util.readJsonAndReturnObject(`${componentsDirPath}/${folder}/${CONSTANTS.JET_COMPONENT_JSON}`);

        if (componentJson.type === 'pack' || componentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
          // Components that belongs to pack
          const packFolderNames = util.getDirectories(`${componentsDirPath}/${folder}`);

          packFolderNames.forEach((packFolderName) => {
            const nestedComponentJsonPath = `${componentsDirPath}/${folder}/${packFolderName}/${CONSTANTS.JET_COMPONENT_JSON}`;
            if (fs.existsSync(nestedComponentJsonPath)) {
              componentsByFolder.push(`${folder}-${packFolderName}`);
            }
          });
        } else {
          // Components
          componentsByFolder.push(folder);
        }
      });
    }

    if (componentsByFolder.length === 0 && componentsInConfigFile.length === 0) {
      util.log.success('No components found.');
    }

    util.printList(componentsInConfigFile, componentsByFolder);
    util.log.success('Components listed.');
    resolve();
  });
};

/**
 * ## package
 *
 * @public
 * @param {array} componentNames
 * @param {Object} [options]
 * @return {Promise}
 */
component.package = function (componentNames, options) {
  return new Promise((resolve) => {
    util.ensureParameters(componentNames, CONSTANTS.API_TASKS.PUBLISH);

    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);
    const opts = options || {};

    // We allow packaging of only a single component
    // If multiple, it would be hard distinguish between
    // single component and a single pack component
    // The syntax follows existing ojet.publish() that provides --pack flag
    // User can script a loop if he wants to package multiple component
    const componentName = componentNames[0];
    let componentPath = _getBuiltComponentPath(componentName, opts);
    const hadBeenBuiltBefore = !!componentPath;

    // Do not allow packaging of individual components in a mono-pack
    if (options.pack) {
      const componentMetadata = util.getComponentJson({
        component: options.pack,
        built: hadBeenBuiltBefore
      });

      if (componentMetadata.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
        util.log.error('Packaging individual components in a mono-pack is not allowed. Package the entire pack instead');
      }
    }

    const componentMetadata = util.getComponentJson({
      component: componentName,
      built: hadBeenBuiltBefore,
      pack: opts.pack
    });

    // This is a data object passed into _createAchive function and the hooks as well.
    // It contains the details about the component/pack being packaged that can also be
    // accessed by programmers through the hooks.
    const context = {
      component: componentNames[0],
      pathToComponent: componentPath,
      ...componentMetadata
    };

    // If pack name was used as the component name
    // package only pack itself (excluding its dependencies)
    if (!opts.pack) {
      // Is it a component of a type 'pack' or mono-pack?
      if ((componentMetadata.type === 'pack' || componentMetadata.type === CONSTANTS.PACK_TYPE.MONO_PACK) &&
        // Pack content is already known, avoid infinite loop. Loop explanation:
        // Under the hood packaging of a pack calls component.package() but with a known content.
        !util.hasProperty(opts, '_contentToArchive')
      ) {
        // Package the pack excluding dependencies
        opts._excludeDependencies = true;
        return packLib.package([componentName], opts);
      }
    }

    // Create archive path - 'dist/<component>' vs. 'temp/<component>'
    const outputDirectory = opts._useTempDir ?
      CONSTANTS.PUBLISH_TEMP_DIRECTORY : CONSTANTS.PACKAGE_OUTPUT_DIRECTORY;
    util.ensureDir(outputDirectory);
    const componentFullName = componentMetadata.pack ? `${componentMetadata.pack}-${componentName}` : componentName;
    const outputArchiveName = `${componentFullName}_${componentMetadata.version.replace(/\./g, '-')}.zip`;
    opts._outputArchiveName = path.join(outputDirectory, outputArchiveName);

    // If we are publishing non-pack component, we trigger standard
    // component build ('ojet build component <component-name>'
    // If we are publishing component from a pack, we need to trigger
    // general build ('ojet build') to build a complete pack
    const buildOptions = opts.pack ? {} : { component: componentName };

    // Should we build component or can we skip that initial step?
    const initalPromise = hadBeenBuiltBefore ? Promise.resolve() : build('web', buildOptions);

    return initalPromise
      .then(() => {
        if (!hadBeenBuiltBefore) {
          // Component hasn't been built before triggering 'ojet package component ...'
          // _getBuiltComponentPath returned empty string
          // Hence we build the component in previous promise
          // Now it is built. We need to get path again to replace empty string with existing path
          componentPath = _getBuiltComponentPath(componentName, opts);
          // Update the component path as needed:
          context.pathToComponent = componentPath;
        }
      })
      .then(() => { // eslint-disable-line
        return hookRunner('before_component_package', context)
          .then(() => _createArchive(componentName, context, opts))
          .then(() => {
            // create this array only when the pack is being packaged:
            if (context.dependencies !== undefined) {
              _createArrayForPathsToArchivedComponentsInPack(context);
              // add the archived pack into the array as well:
              context.pathsToArchivedComponents.push(opts._outputArchiveName);
            } else {
              context.pathsToArchivedComponents = opts._outputArchiveName;
            }
            hookRunner('after_component_package', context);
          });
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};

function _getBuiltComponentPath(componentName, opts) {
  const configPaths = util.getConfiguredPaths();
  let packVersion = '';
  let componentVersion = '';

  if (!opts.pack) {
    // Singleton component or pack
    componentVersion = util.getComponentVersion({ component: componentName });
  } else {
    // Component inside pack
    packVersion = util.getComponentVersion({ component: opts.pack });
    componentVersion = util.getComponentVersion({ pack: opts.pack, component: componentName });
  }

  // A more detailed explanation for the implementation below is found in the function
  // _getPackWebDirPath in the file pack.js in the same folder as this file since its
  // implementation is the same.
  const endDirPathWithVersion = opts.pack ?
    path.join(opts.pack, packVersion, componentName) :
    path.join(componentName, componentVersion);

  const endDirPathWithoutVersion = opts.pack ?
    path.join(opts.pack, componentName) : componentName;

  const versionedComponentWebDirPath = path.join(
    configPaths.staging.web,
    configPaths.src.javascript,
    configPaths.components,
    endDirPathWithVersion
  );

  const unVersionedComponentWebDirPath = path.join(
    configPaths.staging.web,
    configPaths.src.javascript,
    configPaths.components,
    endDirPathWithoutVersion
  );

  const componentJsonInNonVersionedPath = path.join(
    unVersionedComponentWebDirPath,
    'component.json'
  );
  const componentJsonInVersionedPath = path.join(
    versionedComponentWebDirPath,
    'component.json'
  );
  let componentWebDirPath;

  // Let's assume an already built project exists:
  if (util.useUnversionedStructure({ opts })) {
    if (fs.existsSync(componentJsonInVersionedPath)) {
      // Versioned path includes the version-less path; we can copy its contents there.
      fs.copySync(versionedComponentWebDirPath, unVersionedComponentWebDirPath);
      // Remove the versioned path only after ensuring that its contents are successfully
      // copied into the version-less path.
      if (fs.existsSync(componentJsonInNonVersionedPath)) {
        fs.removeSync(versionedComponentWebDirPath);
        componentWebDirPath = unVersionedComponentWebDirPath;
      }
    } else if (fs.existsSync(componentJsonInNonVersionedPath)) {
      // The required structure already exists due to the previous build; so, just direct
      // the packaging process to package the component from there.
      componentWebDirPath = unVersionedComponentWebDirPath;
    }
  } else {
    // Create a temporary folder that we can copy the contents of version-less path into.
    const tempFolder = path.join(configPaths.staging.web, configPaths.src.javascript, 'temp-jet-composites');
    if (fs.existsSync(componentJsonInNonVersionedPath)) {
      if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
      }
      // Copy the contents of version-less folder and then delete its path.
      fs.copySync(unVersionedComponentWebDirPath, tempFolder);
      fs.removeSync(unVersionedComponentWebDirPath);
      // Copy the contents of the tempoarary folder and then deletes its path.
      fs.copySync(tempFolder, versionedComponentWebDirPath);
      fs.removeSync(tempFolder);
      // Check that the versioned path exists before assigning the path.
      if (fs.existsSync(componentJsonInVersionedPath)) {
        componentWebDirPath = versionedComponentWebDirPath;
      }
    } else if (fs.existsSync(componentJsonInVersionedPath)) {
      componentWebDirPath = versionedComponentWebDirPath;
    }
  }

  // For the case when the component is not built already, then just check the required structure
  // and then assign the path accordingly.
  if (!componentWebDirPath) {
    // eslint-disable-next-line max-len
    componentWebDirPath = util.useUnversionedStructure({ opts }) ? unVersionedComponentWebDirPath : versionedComponentWebDirPath;
  }

  const existsInWebDir = fs.existsSync(componentWebDirPath);

  if (!existsInWebDir) {
    return '';
  }

  return componentWebDirPath;
}

/**
 * ## publish
 *
 * @public
 * @param {string} componentName
 * @param {Object} [options]
 */
component.publish = function (componentName, options) {
  return new Promise((resolve) => {
    // The first level function stores user input for the session
    process.env.options = JSON.stringify(options);

    // If path provided, skip building and packaging. Publish directly.
    if (!componentName && util.getOptionsProperty('path')) {
      return _publishExternalArchive(options);
    }

    util.ensureParameters(componentName, CONSTANTS.API_TASKS.PUBLISH);

    const opts = options || {};

    // We allow publishing of only a single component
    // If multiple, it would be hard distinguish between
    // single component and a single pack component
    // User can script a loop if he wants to package multiple component
    let componentPath = _getBuiltComponentPath(componentName, opts);
    const hadBeenBuiltBefore = !!componentPath;

    // Do not allow publishing of individual components in a mono-pack
    if (opts.pack) {
      const componentMetadata = util.getComponentJson({
        component: opts.pack,
        built: hadBeenBuiltBefore
      });

      if (componentMetadata.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
        util.log.error('Publishing individual components in a mono-pack is not allowed. Publish the entire pack instead.');
      }
    }

    // If pack name was used as the component name
    // package only pack itself (excluding its dependencies)

    // We need component's metadata to check if type === 'pack'
    // It's never going to be the case for pack's components. As getting metadata
    // of pack's components is more complex (see _getBuiltComponentPath()) we exclude this case
    if (!opts.pack) {
      // Read the metadata of a first level component
      const componentMetadata = util.getComponentJson({
        component: componentName,
        built: hadBeenBuiltBefore
      });

      // Is it a component of a type 'pack' or 'mono-pack?
      if ((componentMetadata.type === CONSTANTS.PACK_TYPE.MONO_PACK || componentMetadata.type === 'pack') &&
        // Pack content is already known, avoid infinite loop. Loop explanation:
        // Under the hood packaging of a pack calls component.package() but with a known content.
        !util.hasProperty(opts, '_contentToArchive')
      ) {
        // Publish the pack excluding dependencies
        opts._excludeDependencies = true;
        return packLib.publish(componentName, opts);
      }
    }

    // If we are publishing non-pack component, we trigger standard
    // component build ('ojet build component <component-name>'
    // If we are publishing component from a pack, we need to trigger
    // general build ('ojet build') to build a complete pack
    const buildOptions = opts.pack ? {} : { component: componentName };

    // Should we build component or can we skip that initial step?
    const initalPromise = hadBeenBuiltBefore ? Promise.resolve() : build('web', buildOptions);

    const resolvedComponentName = opts.pack ? `'${componentName}' of a pack '${opts.pack}'` : `'${componentName}'`;

    return initalPromise
      .then(() => {
        if (!hadBeenBuiltBefore) {
          // Component hasn't been built before triggering 'ojet package component'
          // _getBuiltComponentPath returned empty string
          // Hence we build the component in previous promise
          // Now it is built. We need to get path again to replace empty string with existing path
          componentPath = _getBuiltComponentPath(componentName, opts);
        }
      })
      .then(() => { // eslint-disable-line
        // Always clear 'temp' directory before publishing
        if (fs.existsSync(CONSTANTS.PUBLISH_TEMP_DIRECTORY)) {
          fs.emptyDirSync(CONSTANTS.PUBLISH_TEMP_DIRECTORY);
        }
        return this.package([componentName], Object.assign(opts, {
          _useTempDir: true,
        }));
      })
      .then(() => { // eslint-disable-line
        return util.loginIfCredentialsProvided();
      })
      .then(() => { // eslint-disable-line
        util.log(`Publishing ${resolvedComponentName}.`);
        return exchangeUtils.uploadToExchange(componentName, opts);
      })
      .then(() => {
        util.log.success(`Component ${resolvedComponentName} was published.`);
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};

function _publishExternalArchive(options) {
  return new Promise((resolve) => {
    const archiveName = path.basename(options.path); // Name of the file e.g. demo-card.zip
    return util.loginIfCredentialsProvided()
      .then(() => {
        util.log.success(`Publishing archive '${archiveName}'.`);
        return exchangeUtils.uploadToExchange(archiveName, options);
      })
      .then(() => {
        util.log.success(`Archive '${archiveName}' was published.`);
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
}

/**
 * ## _createArchive
 * Archives component folder
 *
 * @private
 * @param {string} componentName
 * @param {Object} context
 * @returns {Promise}
 */
function _createArchive(componentName, context, options) {
  return new Promise((resolve, reject) => {
    const opts = options || {};
    const componentPath = context.pathToComponent;

    const output = fs.createWriteStream(opts._outputArchiveName);
    const archive = archiver('zip');

    output.on('close', () => {
      const resolvedComponentName = opts.pack ? `'${componentName}' of a pack '${options.pack}'` : `'${componentName}'`;
      util.log(`Component ${resolvedComponentName} was archived.`);
      resolve();
    });

    archive.on('warning', (error) => {
      util.log.warning(error);
    });

    archive.on('error', (error) => {
      reject(error);
    });

    archive.pipe(output);

    const noTsGlobPattern = '**/*.!(ts|tsx)';

    if (opts && opts._contentToArchive) {
      const customPaths = opts._contentToArchive;
      customPaths.dirs.forEach((dir) => {
        archive.directory(path.join(componentPath, dir), dir);
      });
      customPaths.files.forEach((file) => {
        if (file.endsWith('.d.ts') || !(file.endsWith('.ts') || file.endsWith('.tsx'))) {
          archive.file(path.join(componentPath, file), { name: file });
        }
      });
      customPaths.minFiles.forEach((file) => {
        archive.file(path.join(componentPath, 'min', file), { name: `min/${file}` });
      });
    } else if (opts && opts.pack) {
      // zip component files
      archive.glob(noTsGlobPattern, { cwd: componentPath });
      // include min folder from pack in zip
      const pathToPack = path.join(componentPath, '..');
      const pathToComponentMinFolder = path.join(pathToPack, 'min', componentName);
      if (util.fsExistsSync(pathToComponentMinFolder)) {
        archive.directory(pathToComponentMinFolder, 'min');
      }
      // include types folder from pack in zip
      const pathToComponentTypesFolder = path.join(pathToPack, 'types', componentName);
      if (util.fsExistsSync(pathToComponentTypesFolder)) {
        archive.directory(pathToComponentTypesFolder, 'types');
      }
    } else {
      const vComponent = util.isVComponent({ component: componentName });
      archive.glob(noTsGlobPattern, {
        cwd: componentPath,
        ignore: vComponent ? [`**/${util.getComponentJsDocsJsonFile(componentName)}`] : []
      });
    }
    archive.finalize();
  });
}

/**
 * ## _createArrayForPathsToArchivedComponentsInPack
 * Create an array that contains the paths to the archived components in the pack
 * @private
 * @param {object} context
 */

function _createArrayForPathsToArchivedComponentsInPack(context) {
  context.pathsToArchivedComponents = []; // eslint-disable-line no-param-reassign
  // convert the object to a string:
  const dependenciesString = JSON.stringify(context.dependencies);
  // retrieve the values in the strings, which is of the format:
  // '{"<packName>-<componentName1>":"<version1>",<packName>-<componentName1>":"<version1>"}'
  const stringWithoutCurlyBrackets = dependenciesString.replace('{', '').replace('}', '');
  // Resulting "<packName>-<componentName1>":"<version1>",<packName>-<componentName1>":"<version1>".
  const stringWithoutDoubleQuotes = stringWithoutCurlyBrackets.replace(/"/g, '');
  // Resulting '<packName>-<componentName1>:<version1>, <packName>-<componentName1>:<version1>'.
  // Now strip the string to get each depency and its version:
  const archivedComponentsNameWithVersionArray = stringWithoutDoubleQuotes.split(',');
  archivedComponentsNameWithVersionArray.forEach((element) => {
    const zipFileName = element.replace(':', '_').concat('.zip');
    const pathToArchivedComponent = path.join('dist', zipFileName);
    // add the path into the array:
    context.pathsToArchivedComponents.push(pathToArchivedComponent);
  });
}

/**
 * ## remove
 *
 * @public
 * @param {Array} componentNames
 * @param {Boolean} isStrip
 * @param {Object} options
 */
component.remove = function (componentNames, isStrip, options) {
  return new Promise((resolve) => {
    process.env.options = JSON.stringify(options);
    // Skip this if it's strip and there are no components
    if (isStrip && (!componentNames || componentNames.length === 0)) {
      resolve();
      return;
    }
    util.ensureParameters(componentNames, CONSTANTS.API_TASKS.REMOVE);
    util.loginIfCredentialsProvided()
      .then(() => exchangeUtils.resolve('remove', componentNames))
      .then(_executeSolutions)
      .then(() => {
        if (componentNames.length !== 0 && !isStrip) {
          util.log.success(`Component(s) '${componentNames}' removed.`, options);
        }
        if (isStrip) {
          util.log.success('Strip project finished.');
        }
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};

/**
 * ## label
 *
 * @public
 * @param {String} parameter in the format 'componentName@'version'
 * @param {Object} options
 */
component.label = function (parameter, options) {
  return new Promise((resolve) => {
    const label = options.label;
    const split = parameter.split('@');
    const componentDetails = { name: split[0], version: split[1] };
    process.env.options = JSON.stringify(options);
    return util.loginIfCredentialsProvided()
      .then(() => {
        util.log('Adding label to a component in exchange.\n');
        return exchangeUtils.addComponentLabel(componentDetails, label);
      })
      .then(() => {
        util.log.success('Component labeled.');
        resolve();
      })
      .catch((error) => {
        util.log.error(error, true);
      });
  });
};
