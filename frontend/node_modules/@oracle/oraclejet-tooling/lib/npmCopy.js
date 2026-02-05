/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const constants = require('./constants');
const util = require('./util');
const configGenerator = require('./rjsConfigGenerator');

module.exports = {};
const npmCopy = module.exports;

/**
 * # npmCopy
 * To align with Jet's 3rd party library directory structure, this config will copy from its
 * original npm location to specific path with the file name being modified to include the
 * version string.
 */
npmCopy.getNonMappingFileList = function (buildType) {
  // Remove the @oracle/oraclejet portion after finding it
  const srcPrefix = path.join(path.dirname(path.dirname(util.getOraclejetPath())), path.sep);
  const destPrefix = `${config('paths').staging.web}/${config('paths').src.javascript}/libs`;
  const cssSrcPrefix = `${srcPrefix}/@oracle/oraclejet/dist/css/`;
  const cssCorePackSrcPrefix = `${srcPrefix}/@oracle/oraclejet-preact/amd/`;
  let nonMappingList = [];
  const versions = util.getLibVersionsObj();
  if (!util.getInstalledCssPackage()) {
    if (config('defaultTheme') === constants.DEFAULT_PCSS_THEME) {
      nonMappingList = [
        {
          cwd: `${srcPrefix}requirejs`,
          src: ['*.js'],
          dest: `${destPrefix}/require`
        },
        {
          cwd: `${cssSrcPrefix}alta`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/web`
        },
        {
          cwd: `${cssSrcPrefix}alta-windows`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/windows`
        },
        {
          cwd: `${cssSrcPrefix}alta-android`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/android`
        },
        {
          cwd: `${cssSrcPrefix}alta-ios`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/ios`
        },
        {
          cwd: `${cssSrcPrefix}common`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/common`
        },
        {
          cwd: `${srcPrefix}@oracle/oraclejet/dist/js/libs/oj/resources/nls`,
          src: ['*.js'],
          dest: `${config('paths').staging.stagingPath}/${config('paths').src.javascript}/libs/oj/${util.getJETVersionV(versions.ojs)}/resources/root`
        },
        {
          cwd: `${cssSrcPrefix}redwood`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/redwood/web`
        },
        {
          cwd: `${cssSrcPrefix}stable`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/stable/web`
        },
        {
          cwd: `${cssCorePackSrcPrefix}Theme-redwood`,
          src: ['*.css'],
          dest: `${config('paths').staging.themes}/theme-redwood/web`
        },
        {
          cwd: `${cssCorePackSrcPrefix}images`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/theme-redwood/web/images`
        },
        {
          cwd: `${cssCorePackSrcPrefix}Theme-stable`,
          src: ['*.css'],
          dest: `${config('paths').staging.themes}/theme-stable/web`
        },
        {
          cwd: `${cssCorePackSrcPrefix}images`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/theme-stable/web/images`
        }
      ];
    } else {
      nonMappingList = [
        {
          cwd: `${srcPrefix}requirejs`,
          src: ['*.js'],
          dest: `${destPrefix}/require`
        },
        {
          cwd: `${cssSrcPrefix}alta`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/web`
        },
        {
          cwd: `${cssSrcPrefix}alta-windows`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/windows`
        },
        {
          cwd: `${cssSrcPrefix}alta-android`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/android`
        },
        {
          cwd: `${cssSrcPrefix}alta-ios`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/ios`
        },
        {
          cwd: `${cssSrcPrefix}common`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/alta/common`
        },
        {
          cwd: `${cssCorePackSrcPrefix}Theme-redwood`,
          src: ['*.css'],
          dest: `${config('paths').staging.themes}/theme-redwood/web`
        },
        {
          cwd: `${cssCorePackSrcPrefix}images`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/theme-redwood/web/images`
        },
        {
          cwd: `${cssCorePackSrcPrefix}Theme-stable`,
          src: ['*.css'],
          dest: `${config('paths').staging.themes}/theme-stable/web`
        },
        {
          cwd: `${cssCorePackSrcPrefix}images`,
          src: ['**'],
          dest: `${config('paths').staging.themes}/theme-stable/web/images`
        },
        {
          cwd: `${srcPrefix}@oracle/oraclejet/dist/js/libs/oj/resources/nls`,
          src: ['*.js'],
          dest: `${config('paths').staging.stagingPath}/${config('paths').src.javascript}/libs/oj/${util.getJETVersionV(versions.ojs)}/resources/root`
        }
      ];
    }
  } else {
    nonMappingList = [
      {
        cwd: `${srcPrefix}requirejs`,
        src: ['*.js'],
        dest: `${destPrefix}/require`
      },
      {
        cwd: `${cssSrcPrefix}redwood`,
        src: ['**'],
        dest: `${config('paths').staging.themes}/redwood/web`
      },
      {
        cwd: `${cssSrcPrefix}stable`,
        src: ['**'],
        dest: `${config('paths').staging.themes}/stable/web`
      },
      {
        cwd: `${cssCorePackSrcPrefix}Theme-redwood`,
        src: ['*.css'],
        dest: `${config('paths').staging.themes}/theme-redwood/web`
      },
      {
        cwd: `${cssCorePackSrcPrefix}images`,
        src: ['**'],
        dest: `${config('paths').staging.themes}/theme-redwood/web/images`
      },
      {
        cwd: `${cssCorePackSrcPrefix}Theme-stable`,
        src: ['*.css'],
        dest: `${config('paths').staging.themes}/theme-stable/web`
      },
      {
        cwd: `${cssCorePackSrcPrefix}images`,
        src: ['**'],
        dest: `${config('paths').staging.themes}/theme-stable/web/images`
      },
      {
        cwd: `${srcPrefix}@oracle/oraclejet/dist/js/libs/oj/resources/nls`,
        src: ['*.js'],
        dest: `${config('paths').staging.stagingPath}/${config('paths').src.javascript}/libs/oj/${util.getJETVersionV(versions.ojs)}/resources/root`
      }
    ];
  }

  nonMappingList = util.getFileList(buildType, nonMappingList);

  return nonMappingList;
};

function _getDestPrefix() {
  return `${config('paths').staging.web}`;
}

function _getValidLibObj(buildType, libName, libObj, base) {
  let cwd = libObj.cwd;
  if (libObj[buildType].cwd !== undefined) cwd = path.join(libObj.cwd, libObj[buildType].cwd);
  const nodeModulesPath = path.dirname(path.dirname(util.getOraclejetPath()));
  const newCwd = cwd.replace('node_modules', nodeModulesPath);
  const src = Array.isArray(libObj[buildType].src)
    ? libObj[buildType].src : [libObj[buildType].src];
  const dest = _getValidDestFromPathMapping(libObj[buildType], libName, base);
  if (_needRename(libObj[buildType].src, dest)) {
    const rename = function (pathPrefix) {
      const fileName = path.basename(_processVersionToken(libName, libObj[buildType].path));
      return path.join(pathPrefix, fileName);
    };
    return { cwd: newCwd, src, dest, rename };
  }
  return { cwd: newCwd, src, dest };
}

function _needRename(src, dest) {
  // when the provided src is a single file, and the requirejs path has a different name
  // example in node moduels, the lib is jquery.js, but the path is jquery-3.3.1.js
  if (Array.isArray(src)) return false;
  return path.basename(src) !== path.basename(dest);
}

function _getValidDestFromPathMapping(libObj, libName, base) {
  let dest = (path.extname(libObj.path) === '' || path.extname(libObj.path) === '.min')
    ? libObj.path : path.join(libObj.path, '..');
  dest = _processVersionToken(libName, dest);
  return path.join(_getDestPrefix(), base, dest);
}

function _processVersionToken(libName, destPath) {
  const versions = util.getLibVersionsObj();

  return Object.keys(versions).indexOf(libName) !== -1
    ? util.replaceVersionToken(destPath, versions, libName) : destPath;
}

function _needCopyTask(buildType, lib, libObj) {
  if (!libObj[buildType]) {
    util.log.error(`The path mapping entry (${lib}) is missing an entry for the \"${buildType}\" property. Build failed.`); // eslint-disable-line
  }
  return Object.prototype.hasOwnProperty.call(libObj[buildType], 'src');
}

npmCopy.renameAltaThemeFiles = function (paths) {
  if (!util.getInstalledCssPackage()) {
    const fileList = {
      'oj-alta.css': 'alta.css',
      'oj-alta-min.css': 'alta.min.css'
    };

    const themePath = path.join(paths.staging.themes, constants.DEFAULT_THEME);

    constants.SUPPORTED_PLATFORMS.forEach((platform) => {
      Object.keys(fileList).forEach((key) => {
        fs.renameSync(path.join(themePath, platform, key),
          path.join(themePath, platform, fileList[key]));
      });
    });

    if (config('defaultTheme') === constants.DEFAULT_PCSS_THEME) {
      const redwoodfileList = {
        'oj-redwood.css': 'redwood.css',
        'oj-redwood-min.css': 'redwood.min.css',
        'oj-redwood-notag.css': 'redwood-notag.css',
        'oj-redwood-notag-min.css': 'redwood-notag.min.css'
      };
      const redwoodthemePath = path.join(paths.staging.themes, constants.DEFAULT_PCSS_THEME);
      Object.keys(redwoodfileList).forEach((key) => {
        fs.renameSync(path.join(redwoodthemePath, constants.SUPPORTED_WEB_PLATFORM, key),
          path.join(redwoodthemePath, constants.SUPPORTED_WEB_PLATFORM, redwoodfileList[key]));
      });

      const stablefileList = {
        'oj-stable.css': 'stable.css',
        'oj-stable-min.css': 'stable.min.css'
      };
      const stablethemePath = path.join(paths.staging.themes, constants.DEFAULT_STABLE_THEME);
      Object.keys(stablefileList).forEach((key) => {
        fs.renameSync(path.join(stablethemePath, constants.SUPPORTED_WEB_PLATFORM, key),
          path.join(stablethemePath, constants.SUPPORTED_WEB_PLATFORM, stablefileList[key]));
      });
    }
  } else {
    const fileList = {
      'oj-redwood.css': 'redwood.css',
      'oj-redwood-min.css': 'redwood.min.css',
      'oj-redwood-notag.css': 'redwood-notag.css',
      'oj-redwood-notag-min.css': 'redwood-notag.min.css'
    };

    const themePath = path.join(paths.staging.themes, constants.DEFAULT_PCSS_THEME);
    Object.keys(fileList).forEach((key) => {
      fs.renameSync(path.join(themePath, constants.SUPPORTED_WEB_PLATFORM, key),
        path.join(themePath, constants.SUPPORTED_WEB_PLATFORM, fileList[key]));
    });
    const stablefileList = {
      'oj-stable.css': 'stable.css',
      'oj-stable-min.css': 'stable.min.css'
    };

    const stablethemePath = path.join(paths.staging.themes, constants.DEFAULT_STABLE_THEME);
    Object.keys(stablefileList).forEach((key) => {
      fs.renameSync(path.join(stablethemePath, constants.SUPPORTED_WEB_PLATFORM, key),
        path.join(stablethemePath, constants.SUPPORTED_WEB_PLATFORM, stablefileList[key]));
    });
  }
};

npmCopy.getMappingLibsList = function (buildMode) {
  const buildType = buildMode === 'release' ? 'release' : 'debug';
  const libsList = [];
  const masterJson = util.readPathMappingJson();
  const basePath = masterJson.baseUrl;
  Object.keys(masterJson.libs || {}).forEach((lib) => {
    const libObj = masterJson.libs[lib];
    const isCdn = configGenerator.isCdnPath(
      libObj,
      masterJson.use,
      masterJson.cdns,
      buildType,
      lib
    );
    // Skip copy the library if it uses cdn
    if (!isCdn && _needCopyTask(buildType, lib, libObj)) {
      libsList.push(_getValidLibObj(buildType, lib, libObj, basePath));
    }
  });
  return libsList;
};
