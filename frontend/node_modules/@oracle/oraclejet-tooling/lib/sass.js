/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const path = require('path');
const util = require('./util');
const fs = require('fs-extra');
const CONSTANT = require('./constants');

function _writeSassResultToFile(options, result) {
  if (options.sourceMap) {
    fs.ensureFileSync(`${options.outFile}.map`);
    fs.outputFileSync(`${options.outFile}.map`, result.map);
  }
  fs.ensureFileSync(options.outFile);
  fs.outputFileSync(options.outFile, result.css);
}

function _getSassTaskPromise(options, context) {
  let sass;
  try {
    sass = util.requireLocalFirst('sass');
  } catch (e) {
    try {
      // fall back to node-sass if sass not found
      sass = util.requireLocalFirst('node-sass');
    } catch (e2) {
      util.log.error('sass (or node-sass) is not installed. To install sass, run: ojet add sass.');
    }
  }
  return new Promise((resolve, reject) => {
    sass.render(options, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        _writeSassResultToFile(options, result);
        console.log(`sass compile\n from ${options.file}\n to    ${options.outFile} finished..`);
        resolve(context);
      }
    });
  });
}

function _getSassDest(context, buildType, dest, isReleaseBuild) {
  const name = path.basename(dest, '.scss');
  const isCcaSassFile = util.isCcaSassFile(dest);
  // Force debug extension for Cca sass files because we can't update the references easily
  const ext = isCcaSassFile ? util.getThemeCssExtention('debug') : util.getThemeCssExtention(buildType);
  let sassDest = util.destPath(path.join(path.dirname(dest), name + ext));
  if (isCcaSassFile) {
    const { componentPath, subFolders } = util.getComponentPathFromThemingFileDest({
      context,
      dest,
      isReleaseBuild
    });
    sassDest = util.destPath(path.join(componentPath, subFolders, `${name}${ext}`));
  }
  return sassDest;
}

function _getSassPromises(context) {
  // compile only the changed theme during livereload
  if (context.changedTheme && context.changedTheme.compile) {
    return _getSassTasks(context.changedTheme, context);
  }

  if (context.changedCcaTheme) {
    console.log(`CCA ${context.changedCcaTheme} Changed...`);
    return _getCcaSassTasks(context, true);
  }

  return _getDefaultThemeTasks(context);
}

function _getDefaultThemeTasks(context) {
  const opts = context.opts;
  // compile the default theme
  let taskArray = [];
  if (opts.theme.compile) {
    taskArray = taskArray.concat(_getSassTasks(opts.theme, context));
  }

  // if svg is enabled, re-compile Alta
  if ((opts.svg) && opts.theme.name === CONSTANT.DEFAULT_THEME) {
    taskArray = taskArray.concat(_getAltaSassTasks(opts.theme, context));
  }

  // compile additional multi themes
  if (opts.themes) {
    opts.themes.forEach((singleTheme) => {
      if (singleTheme.compile) {
        taskArray = taskArray.concat(_getSassTasks(singleTheme, context));
      }
    });
  }

  // compile cca
  if (opts.sassCompile) {
    taskArray = taskArray.concat(_getCcaSassTasks(context, false));
  }

  return taskArray;
}

function _getCcaSassTasks(context, isCcaLiveReload) {
  const fileList = util.getFileList(context.buildType, _getCcaFileList(context.opts.sass.fileList));
  return _getSassTasksFromFileList(context.changedCcaTheme, fileList, context, isCcaLiveReload);
}

function _getSassTasks(theme, context) {
  let fileList = _getThemeFileList(context.opts.sass.fileList);
  fileList = util.getFileList(context.buildType, fileList, { theme }, { theme });
  return _getSassTasksFromFileList(theme, fileList, context, false);
}

function _getAltaSassTasks(theme, context) {
  context.opts.theme.directory = _getAltaSourcePath(context.platform); //eslint-disable-line
  let fileList = _getThemeFileList(context.opts.altasass.fileList);
  fileList = util.getFileList(context.buildType, fileList, { theme }, { theme });
  return _getSassTasksFromFileList(theme, fileList, context, false);
}

function _getAltaSourcePath(platform) {
  return path.join(CONSTANT.PATH_TO_ORACLEJET, 'scss', util.mapToSourceSkinName(platform));
}

function _getCcaFileList(fileList) {
  return fileList.filter(fileObj => util.isCcaSassFile(fileObj.cwd));
}

function _getThemeFileList(fileList) {
  return fileList.filter(fileObj => !util.isCcaSassFile(fileObj.cwd));
}

function _getSassTasksFromFileList(theme, fileList, context, isCcaLiveReload) {
  const promiseList = [];
  const opts = context.opts;
  const buildType = context.buildType;
  const sassOpts = _getSassTaskOptions(buildType, opts.sass.options);
  fileList.forEach((file) => {
    const src = file.src;
    const dest = _getSassDest(context, buildType, file.dest, false);
    if (!src || path.basename(src)[0] === '_') {
      // do nothing if the file name starts with underscore
    } else if (isCcaLiveReload && !_matchChangedCca(src, theme)) {
      // do nothing if the SASS file is not in right CCA for livereload
    } else {
      const fileOpts = {
        file: src,
        outFile: dest
      };
      const finalSassOpts = Object.assign({}, sassOpts, fileOpts);
      promiseList.push(_getSassTaskPromise(finalSassOpts, context));
      if (buildType === 'release' && util.isCcaSassFile(file.dest)) {
        // We need a second pass to /min for Cca sass release mode
        const fileOpts2 = {
          file: src,
          outFile: _getSassDest(context, buildType, file.dest, true)
        };
        const finalSassOpts2 = Object.assign({}, sassOpts, fileOpts2);
        promiseList.push(_getSassTaskPromise(finalSassOpts2, context));
      }
    }
  });
  return promiseList;
}

function _getSassTaskOptions(buildType, defaultSassOpts) {
  let sassOpts;
  if (buildType === 'release') {
    sassOpts = {
      outputStyle: 'compressed'
    };
  } else {
    sassOpts = {
      outputStyle: 'expanded'
    };
  }

  return Object.assign({}, sassOpts, defaultSassOpts);
}

function _matchChangedCca(filePath, changedCcaTheme) {
  return filePath.indexOf(changedCcaTheme) !== -1;
}

module.exports = {
  getPromises: context => _getSassPromises(context)
};
