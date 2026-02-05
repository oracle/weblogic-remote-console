/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const glob = require('glob');
const path = require('path');
const util = require('../util');
const fs = require('fs-extra');
const CONSTANTS = require('../constants');

/**
 * ## copyLocalComponent
 *
 * Copy a local component from its source to
 * the staging area
 *
 * @param {object} options
 * @param {object} options.context build context
 * @param {string} options.componentName
 * @param {object} options.componentJson
 * @returns {Promise<object>} promise that resolves with build context
 */
function copyLocalComponent({ context, componentName, componentJson }) {
  return new Promise((resolve, reject) => {
    try {
      generateComponentJsonValidator({
        componentName,
        componentJson
      }).validate();
      const promises = [];
      const { srcBase, destBase } = util.getComponentBasePaths({
        context,
        component: componentName
      });
      const srcPath = path.join(srcBase, componentName);
      const destPath = path.join(
        destBase,
        componentName,
        util.useUnversionedStructure(context) ? '' : componentJson.version
      );
      if (util.isJETPack({ componentJson })) {
        // Only copy top-level jet pack files (e.g component.json) and the extension and
        // utils folders. However, it is legitimate that the packaged folder structure for
        // the mono-pack zip file contains extra folders as not all of the modules exposed
        // by the mono-pack are necessarily within composite components or resource compo-
        // nents. Therefore, do not filter directories in mono-packs when copying its con-
        // tents.
        const pathContentArray = util.union(
          util.getFiles(srcPath),
          componentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK ? getMonoPackDirContents({
            pathToMonopackInSrc: srcPath,
            componentJson,
            context
          }) :
            fs.readdirSync(srcPath).filter(item => item === 'extension' || item === 'utils' || item === '__tests__')
        );
        pathContentArray.forEach((fileInPath) => {
          fs.copySync(
            path.join(srcPath, fileInPath),
            path.join(destPath, fileInPath),
            { dereference: true }
          );
        });
        const packName = componentName;
        const componentsCache = util.getComponentsCache();
        const packComponentJson = componentsCache[packName].componentJson;
        if (util.hasProperty(packComponentJson, 'dependencies') ||
          util.hasProperty(packComponentJson, 'contents')) {
          let packMemberNameList;
          // In mono-pack, we do not add entries in the dependencies for
          // components in the same pack. However, since the entries are
          // used below to retrieve the componentCache for the respective
          // component, then we need to generate the pack member list:
          if (packComponentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
            packMemberNameList = util.union(util.getMonoPackMemberNameList(packComponentJson),
              Object.keys(packComponentJson.dependencies || {}));
          } else {
            packMemberNameList = Object.keys(packComponentJson.dependencies || {});
          }
          packMemberNameList.forEach((packMemberName) => { // eslint-disable-line max-len
            if (packMemberName.startsWith(packName)) {
              const componentCache = componentsCache[packMemberName];
              if (!componentCache) {
                util.log.error(`${packMemberName} is an invalid pack member name. Please make sure that it is available in ${packName}.`);
              }
              const packMemberComponentName = packMemberName.substring(packName.length + 1);
              const packMemberComponentJson = componentCache.componentJson;
              generateComponentJsonValidator({
                packName,
                componentName: packMemberComponentName,
                componentJson: packMemberComponentJson
              }).validate();
              promises.push(
                generateComponentStager({
                  context,
                  componentJson: packMemberComponentJson,
                  srcPath,
                  destPath
                }).stage()
              );
            } else {
              // eslint-disable-next-line no-lonely-if
              if (componentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK) {
                // Do not do anything. It is possible that other pack
                // prefix can be in the mono-pack dependencies object.
              } else {
                util.log.error(`Missing pack prefix for component ${packMemberName} in ${packName}`);
              }
            }
          });
        }
      } else {
        promises.push(
          generateComponentStager({
            context,
            componentJson,
            srcPath,
            destPath
          }).stage()
        );
      }
      Promise.all(promises).then(() => {
        resolve(context);
      }).catch(err => reject(err));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Class used to validate a singleton component's
 * component.json file
 */
class ComponentJsonValidator {
  /**
   *
   * @param {object} options
   * @param {string} options.componentName
   * @param {object} options.componentJson
   */
  constructor({ componentName, componentJson }) {
    this.componentName = componentName;
    this.componentJson = componentJson;
  }
  validate() {
    const { componentName, componentJson } = this;
    if (!util.hasProperty(componentJson, 'name')) {
      util.log.error(`${componentName}\'s component.json is missing a 'name' field`); // eslint-disable-line no-useless-escape
    } else if (componentJson.name !== componentName) {
      util.log.error(`${componentName} does not match the value in the 'name' field of its component.json`);
    }
    if (!util.hasProperty(componentJson, 'version')) {
      util.log.error(`'${componentName}' does not have a 'version' field in its component.json.`);
    }
  }
}

/**
 * Subclass used to validate a pack component's
 * component.json file
 */
class PackComponentJsonValidator extends ComponentJsonValidator {
  /**
   *
   * @param {object} options
   * @param {string} options.packName
   * @param {string} options.componentName
   * @param {object} options.componentJson
   */
  constructor({ packName, componentName, componentJson }) {
    super({ componentName, componentJson });
    this.packName = packName;
  }
  validate() {
    super.validate();
    this._validate();
  }
  _validate() {
    const { packName, componentName, componentJson } = this;
    if (componentJson.pack !== packName) {
      util.log.error(`${packName} does not match the 'pack' field of ${componentName}'s component.json.`);
    }
    if (packName && (componentJson.type === 'pack' || componentJson.type === CONSTANTS.PACK_TYPE.MONO_PACK)) {
      util.log.error(`A pack within a pack is not supported (pack ${packName}, component ${componentJson.name})`);
    }
  }
}

/**
 * ## generateComponentJsonValidator
 *
 * Generate an instance of a componentJson
 * validator based on the provided options
 *
 * @param {object} options
 * @param {string} options.componentName
 * @param {string} options.packName
 * @param {object} options.componentJson
 * @returns {object} componentJson validator
*/
function generateComponentJsonValidator({ componentName, packName, componentJson }) {
  if (packName) {
    return new PackComponentJsonValidator({ packName, componentName, componentJson });
  }
  return new ComponentJsonValidator({ componentName, componentJson });
}

/**
 * Class used to stage a singleton component
*/
class ComponentStager {
  /**
   *
   * @param {object} options
   * @param {object} options.context
   * @param {string} options.srcPath
   * @param {string} options.destPath
   */
  constructor({ context, srcPath, destPath }) {
    this.context = context;
    this.srcPath = srcPath;
    this.destPath = destPath;
    this.destPathRelease = path.join(destPath, 'min');
    this.destComponentJson = null;
  }
  stage() {
    return new Promise((resolve, reject) => {
      try {
        const { context } = this;
        this.stageComponentToDebugLocation();
        if (context.opts.buildType === 'release' || context.componentConfig) {
          this.stageComponentToReleaseLocation();
        }
        resolve(context);
      } catch (error) {
        reject(error);
      }
    });
  }
  stageComponentToDebugLocation() {
    const { srcPath, destPath } = this;
    fs.removeSync(destPath);
    util.ensureDir(destPath);
    let destComponentJson = null;
    fs.copySync(
      srcPath,
      destPath,
      {
        dereference: true,
        filter: function filterTestFolder(item) {
          if (item.endsWith('component.json')) {
            // Log this dest path for possible cleanup later
            destComponentJson = path.join(destPath, 'component.json');
          }
          return !item.startsWith(path.join(srcPath, '__tests__'));
        }
      }
    );
    this.destComponentJson = destComponentJson;
    generateRootIndexFile(srcPath, destPath);
  }
  stageComponentToReleaseLocation() {
    const { srcPath, destPathRelease } = this;
    fs.removeSync(destPathRelease);
    util.ensureDir(destPathRelease);
    const resourcesPath = path.join(srcPath, 'resources');
    if (util.fsExistsSync(resourcesPath)) {
      fs.copySync(resourcesPath, path.join(destPathRelease, 'resources'), { dereference: true });
      generateRootIndexFile(srcPath, destPathRelease);
    }
    const cssFiles = glob.sync('**/*.css', { cwd: srcPath });
    cssFiles.forEach((cssFilePath) => {
      fs.copySync(`${srcPath}/${cssFilePath}`, path.join(destPathRelease, cssFilePath), { dereference: true });
    });
  }
}

/**
 * Subclass used to stage a pack component
*/
class PackComponentStager extends ComponentStager {
  /**
   *
   * @param {object} options
   * @param {object} options.context
   * @param {string} options.srcPath
   * @param {string} options.destPath
   * @param {object} options.componentJson
   */
  constructor({ context, srcPath, destPath, componentJson }) {
    super({ context, srcPath, destPath });
    this.srcPath = path.join(srcPath, componentJson.name);
    this.destPath = path.join(destPath, componentJson.name);
    this.destPathRelease = path.join(destPath, 'min', componentJson.name);
    this.componentJson = componentJson;
  }
}

/**
 * Subclass used to stage a resource component
*/
class ResourceComponentStager extends PackComponentStager {
  /**
   *
   * @param {object} options
   * @param {object} options.context
   * @param {string} options.srcPath
   * @param {string} options.destPath
   * @param {object} options.componentJson
   */
  constructor({ context, srcPath, destPath, componentJson }) {
    super({ context, srcPath, destPath, componentJson });
  }

  stageComponentToDebugLocation() {
    super.stageComponentToDebugLocation();
    // Check if written component.json is missing version, jetVersion
    if (this.destComponentJson) {
      const destJson = fs.readJsonSync(this.destComponentJson);
      if (destJson) {
        if (!destJson.version) {
          destJson.version = this.componentJson.version;
        }
        if (!destJson.jetVersion) {
          destJson.jetVersion = this.componentJson.jetVersion;
        }
        // Write it back out
        fs.writeJsonSync(this.destComponentJson, destJson);
      }
    }
  }

  stageComponentToReleaseLocation() {
    const { srcPath, destPathRelease } = this;
    fs.removeSync(destPathRelease);
    util.ensureDir(destPathRelease);
    const resourceComponentFiles = glob.sync('**/*', { cwd: srcPath, nodir: true, ignore: ['extension/**', '__tests__/**'] });
    resourceComponentFiles.forEach((filePath) => {
      fs.copySync(
        path.join(srcPath, filePath),
        path.join(destPathRelease, filePath),
        { dereference: true }
      );
    });
  }
}

/**
 * Subclass used to stage a vbcs-pattern component
*/
class VbcsPatternComponentStager extends PackComponentStager {
  /**
   *
   * @param {object} options
   * @param {object} options.context
   * @param {string} options.srcPath
   * @param {string} options.destPath
   * @param {object} options.componentJson
   */
  constructor({ context, srcPath, destPath, componentJson }) {
    super({ context, srcPath, destPath, componentJson });
  }
  stageComponentToReleaseLocation() {
    const { srcPath, destPathRelease } = this;
    fs.removeSync(destPathRelease);
    util.ensureDir(destPathRelease);
    const resourceComponentFiles = glob.sync('**/*', { cwd: srcPath, nodir: true, ignore: ['extension/**', '__tests__/**'] });
    resourceComponentFiles.forEach((filePath) => {
      fs.copySync(
        path.join(srcPath, filePath),
        path.join(destPathRelease, filePath),
        { dereference: true }
      );
    });
  }
}

/**
 * ## generateComponentStager
 *
 * Generate an instance of a component stager
 * based on the options provided
 *
 * @param {object} options
 * @param {object} options.context
 * @param {object} options.componentJson
 * @param {string} options.srcPath
 * @param {string} options.destPath
 */
function generateComponentStager({ context, componentJson, srcPath, destPath }) {
  if (componentJson.pack) {
    if (componentJson.type === CONSTANTS.COMPONENT_TYPE.RESOURCE) {
      return new ResourceComponentStager({ context, srcPath, destPath, componentJson });
    } else if (componentJson.type === CONSTANTS.COMPONENT_TYPE.VBCS_PATTERN) {
      return new VbcsPatternComponentStager({ context, srcPath, destPath, componentJson });
    }
    return new PackComponentStager({ context, srcPath, destPath, componentJson });
  }
  return new ComponentStager({ context, srcPath, destPath });
}

/**
 * ## generateRootIndexFile
 *
 * Generate an root index file under the web/../resources/nls folder:
 *
 * @param {string} options.destPath
 */
function generateRootIndexFile(srcPath, destPath) {
  const pathToNlsFolder = path.join(destPath, 'resources', 'nls');
  const pathToNlsRootFolder = path.join(pathToNlsFolder, 'root');
  const pathToNlsRootFolderInSrc = path.join(srcPath, 'resources', 'nls', 'root');
  // Get the array of contents under the nls/root folder, which is the string file:
  util.getFiles(pathToNlsRootFolder).forEach((file) => {
    const pathToComponentStringFile = path.join(pathToNlsFolder, 'root', file);
    const pathToRootIndexFileInWeb = path.join(pathToNlsFolder, file);
    const pathToRootIndexFileInSrc = path.join(srcPath, 'resources', 'nls', file);
    if (fs.existsSync(pathToNlsRootFolderInSrc) && !(fs.existsSync(pathToRootIndexFileInSrc))) {
      // eslint-disable-next-line max-len
      const fileContent = getModifiedComponentStringFileContent(pathToComponentStringFile, pathToNlsFolder);
      fs.writeFileSync(pathToRootIndexFileInWeb, fileContent);
      // Delete the web/../nls/root/<fileName> folder as it is no londer needed:
      if (fs.existsSync(pathToComponentStringFile)) {
        fs.removeSync(pathToComponentStringFile);
      }
      // Delete the web/../nls/root folder if empty as it is no londer needed:
      if (fs.readdirSync(pathToNlsRootFolder).length === 0) {
        fs.removeSync(pathToNlsRootFolder);
      }
    }
  });
}

/**
 * ## getModifiedComponentStringFileContent
 *
 * Modifies the component string file content
 *
 * @param {string} pathToComponentStringFile
 * @param {string} pathToNlsFolder
 */
function getModifiedComponentStringFileContent(pathToComponentStringFile, pathToNlsFolder) {
  // eslint-disable-next-line max-len
  const componentStringFileContent = fs.readFileSync(pathToComponentStringFile, { encoding: 'utf-8' });
  // The retrieved file content in the form:
  // export = {componentName: {sampleString: 'Details...'}}. Therefore, the retrieved
  // object content will be componentName: {sampleString: 'Details...'}.
  const regex = /{(?<exportedObjectContent>.*)}/gms;
  const match = regex.exec(componentStringFileContent);
  // Modify the exported content to export = {root : {componentName: {sampleString: 'Details...'}}}.
  let modifiedStringFileContent = `\n "root": {${match.groups.exportedObjectContent} },`;
  // Go through the nls folder and check if there are any other languages chosen for translation.
  // If there are any, add them as part of the exported object in the form:
  // "<language>": true. In the case German and French are the included languages,
  // then the added items will be: "de":true, "fr":true.
  const nlsFolderContents = fs.readdirSync(pathToNlsFolder);
  nlsFolderContents.forEach((content) => {
    const pathToNlsFolderContent = path.join(pathToNlsFolder, content);
    if (content !== 'root' && fs.lstatSync(pathToNlsFolderContent).isDirectory()) {
      modifiedStringFileContent = modifiedStringFileContent.concat(` \n "${content}": true,`);
    }
  });
  return componentStringFileContent.replace(`${match.groups.exportedObjectContent}`, `${modifiedStringFileContent}\n`);
}

/**
 * ## getMonoPackDirContents
 *
 * returns mono-pack dir contents after verifying the
 * entries in its contents manifest
 *
 * @param {string} pathToMonopackInSrc
 * @param {object} componentJson
 * @param {object} context
 * @returns {array} packDirContents
 */
function getMonoPackDirContents({ pathToMonopackInSrc, componentJson, context }) {
  const packName = componentJson.name;
  const contentsArray = componentJson.contents || [];
  const packDirContents = fs.readdirSync(pathToMonopackInSrc);

  // Traverse the contents array to check if the listed item is in the pack directory
  // and confirm if it has right information in its component json file, if it exists.
  contentsArray.forEach((content) => {
    const contentName = content.name;
    const contentMainEntry = content.main;

    if (!packDirContents.includes(contentName) && !contentMainEntry) {
      util.log.error(`Your mono-pack "${packName}" has no content "${contentName}" in its folder.`);
    } else {
      const isLocalComponent = util.isLocalComponent({ pack: packName, component: content.name });
      if (isLocalComponent) {
        verifyComponentContentInMonoPack({ componentJson, content, context });
      } else {
        verifyNonComponentContentInMonoPack({ pathToMonopackInSrc, content, componentJson });
      }
    }
  });

  // We return all pack dir contents here as it could be the case that there are
  // contents (example, private components) that are not mentioned in the contents
  // manifest but still need to be processed as part of the mono-pack.
  return packDirContents;
}

/**
 * ## verifyNonComponentContentInMonoPack
 *
 * @param {object} content
 * @param {object} componentJson
 * @param {string} pathToMonopackInSrc
 */
function verifyNonComponentContentInMonoPack({ pathToMonopackInSrc, content, componentJson }) {
  const contentName = content.name;
  const contentMainEntry = content.main;
  const packName = componentJson.name;
  if (contentMainEntry) {
    // Let's assume the structure of main entry is <folderName>/<fileName>:
    const pathToMainEntryInSrc = path.join(pathToMonopackInSrc, contentMainEntry);
    if (!fs.existsSync(pathToMainEntryInSrc)) {
      util.log.error(`Content "${contentName}" has a main entry "${contentMainEntry}" that is not in the pack "${packName}".`);
    }
  } else {
    const pathToContentInSrc = path.join(pathToMonopackInSrc, contentName);
    if (!fs.existsSync(pathToContentInSrc)) {
      util.log.error(`Content "${contentName}" is declared in the content manifest but it is not in the pack "${packName}".`);
    }
  }
}

/**
 * ## verifyComponentContentInMonoPack
 *
 * @param {object} content
 * @param {object} context
 * @param {object} componentJson
 */
function verifyComponentContentInMonoPack({ componentJson, content, context }) {
  const packName = componentJson.name;
  const contentName = content.name;
  // We refer to isTypescriptComponent and isVComponent here because we cannot create
  // a mono-pack in a js project. Thus, the created mono-pack will always be in the ts
  // folder. Moreover, for the case of the VDOM architecure, the created component in
  // the mono-pack will always be a vcomponent:
  const isVComponent = util.isVComponent({
    pack: packName,
    component: contentName
  });
  const isTypescriptComponent = util.isTypescriptComponent({
    pack: packName,
    component: contentName
  });

  if (isVComponent) {
    // vcomponents do not have component json files at this point; so, we can't check
    // the component json to verify component's info. Hence, assume it has valid info;
    // so, do nothing. This component will be revisited after compilation for
    // verification.
  } else if (isTypescriptComponent) {
    const contentComponentJson = util.getComponentJson({
      context,
      pack: packName,
      component: contentName,
      built: false
    });
    const componentTypes = ['composite', 'resource', undefined];
    // Check if the component name and type info is correct:
    if (contentComponentJson.name !== contentName) {
      util.log.error(`Listed component "${contentName}" name does not match the one in its component.json file.`);
    } else if (!componentTypes.includes(contentComponentJson.type)) {
      util.log.error(`Component "${contentName}" has invalid type in its component.json file.`);
    } else if (!contentComponentJson.pack && contentComponentJson.type !== 'resource') {
      util.log.error(`Component "${contentName}" does not have a pack property defined in its component.json file.`);
    } else if (contentComponentJson.pack && contentComponentJson.pack !== packName) {
      util.log.error(`The name of the pack in "${contentName}" component json does not match with pack ${packName}`);
    }
  }
}

module.exports = copyLocalComponent;
