/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const util = require('./util');
const DEFAULT_CONFIG = require('./defaultconfig');
const CONSTANTS = require('./constants');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

module.exports = {
  theme: function _validateTheme(options, platform) {
    return _setValidThemeOption(options, platform);
  },

  buildType: function _validateBuildType(options) {
    const buildType = options.buildType;
    if (buildType && buildType !== 'undefined') {
      if (buildType === 'release' || buildType === 'dev') {
        return buildType;
      } else if (buildType === 'debug') {
        return 'dev';
      }
      util.log.error(`Option buildType ${buildType} is invalid!`);
      return false;
    }
    return 'dev';
  },

  buildOptions: function _validateOption(options, platform, buildForLiveReload) {
    let opts = options || {};
    const defaultConfig = _getDefaultBuildConfig(platform);
    opts = util.mergePlatformOptions(opts, platform);
    opts = util.mergeDefaultOptions(opts, defaultConfig);
    opts = (buildForLiveReload || opts.buildForServe) ? opts : _setValidThemeOption(opts, platform);
    opts = (buildForLiveReload || opts.buildForServe) ? opts : _setValidDestination(opts);
    return opts;
  },

  getDefaultServeConfig: () => _getDefaultServeConfig(),

  getThemeObject: (themeStr, platform) => _getValidThemeObject(themeStr, platform),

  sassInstall: () => _validateSassInstall(),

  component: function _validateComponent(options) {
    // Check for invalid use of path separators.
    // Recommend using ojet build if the user has tried to build an individual pack component.
    const [pack, component] = path.normalize(options.component).split(path.sep);
    if (pack && component) {
      if (util.isWebComponent({ pack, component })) {
        util.log.error('Builds of individual pack components are not supported. Please use ojet build instead.');
      } else {
        util.log.error(`Invalid syntax for component - path separators (${path.sep}) are not supported.`);
      }
    }
  }
};

function _getDefaultBuildConfig() {
  return _convertConfigFunctionToObj(DEFAULT_CONFIG.build);
}

function _getDefaultServeConfig() {
  return _convertConfigFunctionToObj(DEFAULT_CONFIG.serve);
}

function _convertConfigFunctionToObj(input) {
  const result = {};
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (typeof value === 'function') {
      result[key] = value(config('paths'));
    } else {
      result[key] = value;
    }
  });
  return result;
}

// todo - do we want to rewrite the no-param-reassign for options ?
function _setValidDestination(options) {
  if (options.destination) {
    if (CONSTANTS.SUPPORTED_BUILD_DESTINATIONS.indexOf(options.destination) === -1) {
      util.log.error(`Destination ${options.destination} not supported. `);
    }
  } else {
  // eslint-disable-next-line no-param-reassign
    options.destination = CONSTANTS.DEFAULT_BUILD_DESTINATION;
  }
  return options;
}

function _setDefaultTheme(options, platform) {
  let defaultTheme = options.theme;
  if (!options.theme && options.themes) {
    // default to alta theme if options.themes equlats to 'all' or 'all:all';
    let themeName = _getThemeNameFromStr(options.themes[0]);
    let themePlatform = _getThemePlatformFromStr(options.themes[0], platform);
    themeName =
    (themeName === CONSTANTS.RESERVED_Key_ALL_THEME) ? config('defaultTheme') : themeName;
    themePlatform =
          (themePlatform === CONSTANTS.RESERVED_Key_ALL_THEME) ? platform : themePlatform;
    defaultTheme = `${themeName}:${themePlatform}`;
  }
  return defaultTheme;
}

function _getThemeNameFromStr(themeStr) {
  return (themeStr.indexOf(':') === -1) ? themeStr : themeStr.split(':')[0];
}
function _getThemePlatformFromStr(themeStr, defaultPlatform) {
  return (themeStr.indexOf(':') === -1) ? defaultPlatform : themeStr.split(':')[1];
}

// todo - do we want to rewrite the no-param-reassign for themeStr and platform ?
function _getValidThemeObject(themeStr, platform) {
  const themeObj = {};
  if (themeStr) {
    themeStr = themeStr.replace('browser', 'web'); // eslint-disable-line no-param-reassign
    platform = platform.replace('browser', 'web'); // eslint-disable-line no-param-reassign

    if (themeStr.indexOf(':') === -1) {
      themeObj.name = themeStr;
      themeObj.platform = platform;
      themeObj.compile = _setSassCompile(themeObj);
    } else {
      const args = themeStr.split(':');
      themeObj.name = args[0];
      themeObj.platform = args[1];
      themeObj.compile = _setSassCompile(themeObj);
    }
  } else {
    themeObj.name = config('defaultTheme');
    themeObj.platform = platform;
    themeObj.compile = _setSassCompile(themeObj);
  }
  const THEME_DATA = _getThemeInfo(themeObj.name);
  themeObj.version = THEME_DATA.versionNumber();
  themeObj.cssGeneratedType = THEME_DATA.generatedType();
  themeObj.basetheme = THEME_DATA.baseThemeType();
  return themeObj;
}

// todo - do we want to rewrite the no-param-reassign for options ?
// (disabled the eslint check for now)
function _setValidThemeOption(options, platform) {
  const themeStr = _setDefaultTheme(options, platform);
  options.theme = _getValidThemeObject(themeStr, platform); // eslint-disable-line no-param-reassign
  options.themes = _processThemesOption(options, platform); // eslint-disable-line no-param-reassign
  /* console.log(`Theme Name:Platform - ${options.theme.name}:${options.theme.platform}
                  \nTheme Version - ${options.theme.version}`);*/
  return options;
}

function _getThemesArray(themesOption, platform) {
  if (themesOption[0] === CONSTANTS.RESERVED_Key_ALL_THEME) {
    return util.getAllThemes();
  } else if (themesOption[0] === `${CONSTANTS.RESERVED_Key_ALL_THEME}:${CONSTANTS.RESERVED_Key_ALL_THEME}`) {
    // get all possible combinations when --themes =all:all
    let themesArray = [];
    const allThemes = util.getAllThemes();
    allThemes.forEach((singleTheme) => {
      const tempArray = _getThemesArrayForAllPlatforms(singleTheme);
      themesArray = themesArray.concat(tempArray);
    });
    // todo - Arrow function used ambiguously with a conditional function (no-confusing-arrow)
    const altaThemes = CONSTANTS.SUPPORTED_PLATFORMS.reduce(
      (previousValue, currentValue) =>
        ((currentValue === platform) &&
            _checkThemeFileExist(CONSTANTS.DEFAULT_THEME, currentValue) ?
          previousValue : previousValue.concat([`${CONSTANTS.DEFAULT_THEME}:${currentValue}`])), []);
    themesArray = themesArray.concat(altaThemes);
    return themesArray;
  }
  let result = [];
  themesOption.forEach((themeStr) => {
    const themeName = _getThemeNameFromStr(themeStr);
    const themePlatform = _getThemePlatformFromStr(themeStr, platform);
    // Handle --themes=themeName:all situation
    if (themePlatform === CONSTANTS.RESERVED_Key_ALL_THEME) {
      const tempArray = _getThemesArrayForAllPlatforms(themeName);
      result = result.concat(tempArray);
    } else if (themeName === CONSTANTS.RESERVED_Key_ALL_THEME) {
      const tempArray = _getThemesArrayForAllThemes(themePlatform);
      result = result.concat(tempArray);
    } else {
      result.push(`${themeName}:${themePlatform}`);
    }
  });
  return result;
}

function _getThemesArrayForAllPlatforms(themeName) {
  const allPlatforms = CONSTANTS.SUPPORTED_PLATFORMS;
  // todo - Arrow function used ambiguously with a conditional function (no-confusing-arrow)
  const tempArray =
        allPlatforms.reduce((previousValue, currentValue) =>
          (_checkThemeFileExist(themeName, currentValue) ?
            previousValue.concat([`${themeName}:${currentValue}`]) : previousValue), []);
  return tempArray;
}

function _getThemesArrayForAllThemes(themePlatform) {
  const allThemes = util.getAllThemes();
  // todo - Arrow function used ambiguously with a conditional function (no-confusing-arrow)
  const tempArray = allThemes.reduce((previousValue, currentValue) =>
    (_checkThemeFileExist(currentValue, themePlatform) ?
      previousValue.concat([`${currentValue}:${themePlatform}`]) : previousValue), []);
  return tempArray;
}

function _checkThemeFileExist(themeName, themePlatform) {
  const themesDir = util.destPath(path.join(config('paths').staging.themes, themeName, themePlatform));
  const themesSrcDir = util.destPath(path.join(config('paths').src.common, config('paths').src.themes, themeName, themePlatform));
  return _checkPathExist(themesDir) || _checkPathExist(themesSrcDir);
}

function _processThemesOption(options, platform) {
  if (options.themes) {
    let themesArray = _getThemesArray(options.themes, platform);
    const defaultTheme = `${options.theme.name}:${options.theme.platform}`;
    // Remove theme that is duplicate with default theme
    themesArray = themesArray.filter(element => element !== defaultTheme);
    themesArray = themesArray.map(singleTheme => _getValidThemeObject(singleTheme, platform));
    return themesArray;
  }
  return undefined;
}

function _getThemeInfo(themeName) {
  const themeJsonPath = util.destPath(path.join(config('paths').src.common, config('paths').src.themes, themeName, 'theme.json'));
  let themeJson;
  if (_checkPathExist(themeJsonPath)) {
    themeJson = fs.readJsonSync(themeJsonPath);
  }

  return {
    versionNumber: () => {
      if (themeName === CONSTANTS.DEFAULT_THEME || themeName === CONSTANTS.DEFAULT_PCSS_THEME ||
        themeName === CONSTANTS.DEFAULT_STABLE_THEME) {
        return util.getJETVersion();
      }
      if (themeJson) {
        return util.hasProperty(themeJson, 'version') ? themeJson.version : '';
      }
      return '';
    },

    generatedType: () => {
      if (themeJson) {
        return util.hasProperty(themeJson, 'generatedFileType') ? themeJson.generatedFileType : '';
      }
      return '';
    },

    baseThemeType: () => {
      if (themeJson) {
        return util.hasProperty(themeJson, 'basetheme') ? themeJson.basetheme : '';
      }
      return '';
    }
  };
}

function _setSassCompile(theme) {
  // if alta, skip checking src/themes
  if (theme.name === CONSTANTS.DEFAULT_THEME || theme.name === CONSTANTS.DEFAULT_PCSS_THEME ||
    theme.name === CONSTANTS.DEFAULT_STABLE_THEME) {
    return false;
  }
  // If the set default theme is redwood-notag, then change the theme name to redwood since
  // it is the parent folder that contains the redwood-notag. If the changed path exists, then
  // the redwood-notag exists as well:
  const themeName = (theme.name === CONSTANTS.REDWOOD_NOTAG_THEME) ? CONSTANTS.DEFAULT_PCSS_THEME
    : theme.name;
  const srcExist = _checkPathExist(path.join(config('paths').src.common, config('paths').src.themes, themeName));
  const themeExist = _checkPathExist(path.join(config('paths').staging.themes, themeName));

  if (srcExist) {
    // src/themes/theme exists, compile sass
    _validateSassInstall();
    return true;
  } else if (themeExist) {
    // src/theme missing but themes presence, skip sass compile
    return false;
  }
  util.log.error(`Theme '${theme.name}:${theme.platform}' does not exist in ` +
  `${config('paths').staging.themes} or ${config('paths').src.common}/${config('paths').src.themes}`);
  return false;
}

function _checkPathExist(themePath) {
  try {
    fs.statSync(themePath);
    return true;
  } catch (err) {
    return false;
  }
}

function _validateSassInstall() {
  const sassPackageJson = util.getModulePath(path.join('node_modules', 'sass', 'package.json'), 'sass');

  if (fs.existsSync(sassPackageJson)) {
    return true;
  }

  // Check node-sass fallback
  const nodeSassPackageJson = util.getModulePath(path.join('node_modules', 'node-sass', 'package.json'), 'node-sass');
  if (fs.existsSync(nodeSassPackageJson)) {
    return true;
  }

  return false;
}

