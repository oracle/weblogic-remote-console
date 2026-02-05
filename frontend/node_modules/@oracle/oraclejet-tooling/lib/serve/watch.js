/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

/**
 * # Dependencies
 */
const path = require('path');
const chokidar = require('chokidar');
const tinylr = require('tiny-lr');

const watchall = {
  running: false
};
const watchers = {};

const buildCommon = require('../buildCommon');
const serveWebFileChangeHandler = require('../serveWebFileChangeHandler');
const util = require('../util');
const config = require('../config');
const valid = require('../validations');
const constants = require('../constants');
const hookRunner = require('../hookRunner');

/**
 * # serve Watch Module
 *
 * @public
 */
module.exports = function (opts, livereloadPort, context) {
  _modifySourceFilesGlobPattern(opts);
  const watchOpts = _addSrcOverride(opts);
  const watchFiles = context.serveOpts.watchFiles;
  return new Promise((resolve, reject) => {
    if (watchall.running === false) {
      _startLiveReloadServer(watchOpts, livereloadPort, context)
        .then(() => {
          if (watchFiles) {
            util.log('Starting watcher.');
            _startWatchers(opts, context);
          }
        })
        .then(() => {
          if (watchFiles) {
            watchall.running = true;
          }
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve();
    }
  });
};

function _modifySourceFilesGlobPattern(opts) {
  const sourceAttribute = Object.getOwnPropertyNames(opts);
  sourceAttribute.forEach((attribute) => {
    _modifyFilePathGlobPattern(attribute, opts);
  });
}

// The glob pattern follow the js/ts file src folder format with js/ts subfolders.
// Vdom apps do not have the js/ts folder(s); therefore, there is an additional /./
// in the glob pattern src/./**/*.<file type>, which seems to make the add event not
// fire. Removing the /./ ensures the added event fires.
function _modifyFilePathGlobPattern(attribute, opts) {
  opts[attribute].files.forEach((file, index) => {
    // eslint-disable-next-line no-param-reassign
    opts[attribute].files[index] = file.replace('src/./', 'src/');
  });
}

function _addSrcOverride(opts) {
  const result = opts;
  const srcOverrideDir = config('paths').src.web;
  result.sourceFiles.files.push(`${srcOverrideDir}/**/*`);
  return result;
}

function _startLiveReloadServer(opts, port, context) {
  return new Promise((resolve, reject) => {
    const livereload = context.serveOpts.livereload;
    const server = context.liveReloadServer ? context.liveReloadServer : tinylr({ port });
    if (server && server.listen && livereload) {
      // Only listen if listen is available and livereload not disabled.
      server.listen(port, (err) => {
        if (err) {
          reject(err);
        }
        util.log(`Listening on port ${port}.`);
        watchall.server = server;
        resolve(opts);
      });
    } else {
      resolve(opts);
    }
  });
}

function _startWatchers(opts, context) {
  util.log('Watching files.');
  const userOptions = context.userOptions;
  const intervalValue = util.getOraclejetConfigJson().watchInterval;
  util.log(`Watching Interval: ${intervalValue}.`);
  return new Promise((resolve, reject) => {
    try {
      Object.keys(opts).forEach((watchTarget) => {
        // eslint-disable-next-line max-len
        watchers[watchTarget] = _startWatcher(watchTarget, intervalValue, opts, userOptions);
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function _startWatcher(target, intervalValue, opts, userOptions) {
  const targetFiles = opts[target].files;
  const watcher = chokidar.watch(targetFiles,
    { usePolling: true, interval: intervalValue, ignoreInitial: true });

  // Using watcher.on(...) seems to have some issues; hence, the use of watcher.once(...).
  // See: https://github.com/paulmillr/chokidar/issues/286#issuecomment-94285269.
  watcher.once('ready', () => {
    util.log(`Watcher: ${target} is ready.`);
  });

  watcher.on('change', (file) => {
    util.log(`Changed: ${file}`);
    const watcherContext = {};
    watcherContext.watcher = { action: 'changed', file };
    watcherContext.userOptions = userOptions;

    hookRunner('before_watch', watcherContext);

    _defaultFileChangeHandler({ opts, target, filePath: file })
      .then(_runCustomPostWatchPromise)
      .then(() => {
        if (watchall.server) {
          watchall.server.changed({ body: { files: [file] } });
        }
        hookRunner('after_watch', watcherContext);
        util.log('Page reloaded resume watching.');
      })
      .catch((err) => {
        util.log.error(err);
      });
  });

  watcher.on('add', (file) => {
    util.log(`Added: ${file}`);
    const watcherContext = {};
    watcherContext.watcher = { action: 'added', file };
    hookRunner('before_watch', watcherContext);
    _defaultFileChangeHandler({ opts, target, filePath: file })
      .then(() => {
        watchall.server.changed({ body: { files: [file] } });
        hookRunner('after_watch', watcherContext);
        util.log('Page reloaded resume watching.');
      })
      .catch((err) => {
        util.log.error(err);
      });
  });

  return watcher;
}

function _defaultFileChangeHandler(context) {
  const buildContext = _getBuildContext();

  const filePath = context.filePath;

  return new Promise((resolve, reject) => {
    try {
      if (_isThemeFile(filePath)) {
        if (util.isCcaSassFile(filePath)) {
          config('changedCcaTheme', _getCcaPath(filePath));
          config('changedTheme', null);
        } else {
          config('changedTheme', _getThemeObjFromPath(filePath));
          config('changedCcaTheme', null);
        }
        resolve(context);
      } else if (config.get('platform') === constants.SUPPORTED_WEB_PLATFORM) {
        serveWebFileChangeHandler(filePath, buildContext).then(() => {
          resolve(context);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}

function _runCustomPostWatchPromise(context) {
  // programmatically build a promise chain to run all custom commands in sequence
  let commandSequence = Promise.resolve();
  const customCommands = context.opts[context.target].commands;
  if (!customCommands) {
    return commandSequence;
  }
  util.log(`Trigggering commands ${customCommands}.`);
  customCommands.forEach((command) => {
    const commandPromise = _getCommandPromise(command);
    commandSequence = commandSequence.then(() => commandPromise)
      .then(() => {
        util.log(`Command ${command} completed..`);
      });
  });
  return commandSequence;
}

function _getCommandPromise(command) {
  if (command === 'compileSass') {
    return _getCompileSassPromise();
  }

  if (command === 'copyThemes') {
    return _getCopyThemePromise();
  }

  return util.exec(command);
}

function _getCompileSassPromise() {
  // Skip sass compile tasks if the global sass compile is disabled
  if (config('serve').sassCompile === false) {
    return Promise.resolve();
  }

  const context = _getBuildContext();
  context.changedTheme = _getThemeObjFromName(config('changedTheme'), context.opts);
  context.changedCcaTheme = config('changedCcaTheme');
  return new Promise((resolve, reject) => {
    buildCommon.css(context)
      .then(buildCommon.copyThemes)
      .then(() => {
        resolve();
      })
      .catch(err => reject(err));
  });
}

function _getCopyThemePromise() {
  const context = _getBuildContext();
  context.changedTheme = _getThemeObjFromName(config('changedTheme'), context.opts);
  return new Promise((resolve, reject) => {
    buildCommon.copyThemes(context)
      .then(() => {
        resolve();
      })
      .catch(err => reject(err));
  });
}

function _isThemeFile(filePath) {
  const srcThemes = new RegExp(config('paths').src.themes);
  const stagingThemes = new RegExp(config('paths').staging.themes);
  const srcPath = new RegExp(config('paths').src.common);
  return srcThemes.test(filePath) || stagingThemes.test(filePath)
    || path.extname(filePath) === '.scss' || (path.extname(filePath) === '.css' && !srcPath.test(filePath));
}

function _getCcaPath(filePath) {
  const configPaths = util.getConfiguredPaths();
  const pathArray = filePath.split(path.sep);
  // cca index +1 to get one level down /jet-composites and +1 for the slice
  const ccaIndex = pathArray.indexOf(configPaths.components) + 2;
  return path.normalize(pathArray.slice(0, ccaIndex).join(path.sep));
}

function _getThemeObjFromPath(filePath) {
  const allThemes = util.getAllThemes();
  const result = {};
  const themeName = allThemes.filter(singleTheme => filePath.indexOf(singleTheme) !== -1);
  if (themeName.length === 1) {
    result.name = themeName[0];
  } else {
    // find the theme with longest legnth ['alta', 'alta_test']
    result.name = themeName.reduce((acc, cur) => ((cur.length > acc.length) ? cur : acc), '');
  }
  const allPlatforms = constants.SUPPORTED_PLATFORMS;
  let themePlatform = config('platform');
  allPlatforms.forEach((singlePlatform) => {
    themePlatform = (filePath.indexOf(singlePlatform) === -1) ? themePlatform : singlePlatform;
  });
  result.platform = themePlatform;
  return result;
}

function _getThemeObjFromName(theme, opts) {
  if (theme === null) return null;
  if (theme.name === opts.theme.name) {
    return opts.theme;
  }
  return valid.getThemeObject(theme.name, theme.platform);
}

function _getBuildContext() {
  const validPlatform = config.get('platform');
  const options = valid.buildOptions(config.get('serve'), validPlatform, true);
  const validBuildType = valid.buildType(options);
  options.buildType = validBuildType;
  options.cssonly = true;
  options.themes = undefined; // disable compiling all themes for livereload
  const context =
    {
      buildType: validBuildType,
      opts: options,
      platform: validPlatform
    };
  return context;
}
