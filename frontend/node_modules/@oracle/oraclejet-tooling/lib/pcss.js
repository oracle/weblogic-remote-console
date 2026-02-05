/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const util = require('./util');
const fs = require('fs-extra');
const path = require('path');

function _getPcssPromises(context) {
  // compile only the changed theme during livereload
  if (context.changedTheme && context.changedTheme.compile) {
    return _getPcssTasks(context.changedTheme, context);
  }

  if (context.changedCcaTheme) {
    console.log(`CCA ${context.changedCcaTheme} Changed...`);
    return _getCcaPcssTasks(context, true);
  }

  return _getDefaultPcssThemeTasks(context);
}

function _getDefaultPcssThemeTasks(context) {
  const opts = context.opts;
  // compile the default theme
  let taskArray = [];

  if (opts.theme) {
    // compile additional multi themes
    if (opts.themes) {
      opts.themes.forEach((singleTheme) => {
        if (singleTheme.compile) {
          taskArray = taskArray.concat(_getPcssTasks(singleTheme, context));
        }
      });
    } else {
      taskArray = taskArray.concat(_getPcssTasks(opts.theme, context));
    }
  }

  // // if svg is enabled, re-compile Alta
  // if ((opts.svg) && opts.theme.name === CONSTANT.DEFAULT_THEME) {
  //   taskArray = taskArray.concat(_getAltaSassTasks(opts.theme, context));
  // }

  // compile cca
  if (opts.sassCompile) {
    taskArray = taskArray.concat(_getCcaPcssTasks(context, false));
  }

  return taskArray;
}

function _getCcaPcssTasks(context, isCcaLiveReload) {
  const fileList = util.getFileList(context.buildType, _getCcaFileList(context.opts.pcss.fileList));
  return _getPcssTasksFromFileList(context.changedCcaTheme, fileList, context, isCcaLiveReload);
}

function _getPcssTasks(theme, context) {
  let fileList = _getPcssThemeFileList(context.opts.pcss.fileList);
  fileList = util.getFileList(context.buildType, fileList, { theme }, { theme });
  return _getPcssTasksFromFileList(theme, fileList, context, false);
}

function _getCcaFileList(fileList) {
  return fileList.filter(fileObj => util.isCcaSassFile(fileObj.cwd));
}

function _getPcssThemeFileList(fileList) {
  return fileList.filter(fileObj => !util.isCcaSassFile(fileObj.cwd));
}

function _getPcssDest(context, buildType, dest, isReleaseBuild) {
  const name = path.basename(dest, '.scss');
  const isCcaSassFile = util.isCcaSassFile(dest);
  // Force debug extension for Cca sass files because we can't update the references easily
  const ext = isCcaSassFile ? util.getThemeCssExtention('debug') : util.getThemeCssExtention(buildType);
  let pcssDest = util.destPath(path.join(path.dirname(dest), `${name}${ext}`));
  if (isCcaSassFile) {
    const { componentPath, subFolders } = util.getComponentPathFromThemingFileDest({
      context,
      dest,
      isReleaseBuild
    });
    pcssDest = util.destPath(path.join(componentPath, subFolders, `${name}${ext}`));
  }
  return pcssDest;
}

function _writePcssResultToFile(options, result) {
  if (options.sourceMap) {
    fs.ensureFileSync(`${options.outFile}.map`);
    fs.outputFileSync(`${options.outFile}.map`, result.map);
  }
  fs.ensureFileSync(options.outFile);
  fs.outputFileSync(options.outFile, result.css);
}

function _writeCustomizedCss(postcss, gplugin, outFile, destFile, option) {
  return new Promise((resolve, reject) => {
    let processoption = {};
    // set the from property to undefined to avoid postcss warning
    if (!option) {
      processoption = {
        parser: postcss,
        from: undefined
      };
    } else {
      processoption = {
        processors: [
          gplugin({ overrideBrowserslist: 'last 2 Edge major versions, last 2 chrome major version, last 2 firefox major version, firefox esr, ie 11, last 2 safari major version, last 2 ios major version' })
        ],
        parser: postcss,
        from: undefined
      };
    }
    postcss(gplugin).process(outFile, processoption)
      .then((result) => {
        fs.ensureFileSync(destFile);
        fs.outputFileSync(destFile, result.css);
        resolve();
      })
      .catch(err => reject(err));
  });
}

function _getPcssTaskPromise(options, context) {
  let sass;
  try {
    sass = util.requireLocalFirst('sass');
  } catch (e) {
    try {
      // fallback
      sass = util.requireLocalFirst('node-sass');
    } catch (e2) {
      util.log.error('sass (or node-sass) is not installed. To install sass, run: ojet add sass.');
    }
  }
  const postcss = util.requireLocalFirst('postcss');
  const pcssCalc = util.requireLocalFirst('postcss-calc');
  const autoPrefix = util.requireLocalFirst('autoprefixer');
  return new Promise((resolve, reject) => {
    sass.render(options, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        _writePcssResultToFile(options, result);
        console.log(`Pcss compile\n From => ${options.file}\n To =>    ${options.outFile} finished..`);

        // compile custom property css to variable converted to value css
        const css = util.readFileSync(options.outFile);
        new Promise((resolve, reject) => { // eslint-disable-line
          _writeCustomizedCss(postcss, pcssCalc, css, options.outFile);
          console.log(`Pcss calc compile\n To => ${options.outFile} finished..`);
          resolve();
        })
          .then(() => {
            const autoprefixvarscss = util.readFileSync(options.outFile);
            _writeCustomizedCss(postcss, autoPrefix, autoprefixvarscss, options.outFile, 'prefix');
            console.log(`Pcss Autoprefixer compile\n To => ${options.outFile} finished..`);
            resolve();
          });
        resolve(context);
      }
      return true;
    });
  });
}

function _getPcssTasksFromFileList(theme, fileList, context, isCcaLiveReload) {
  const promiseList = [];
  const opts = context.opts;
  const buildType = context.buildType;
  const pcssOpts = _getPcssTaskOptions(buildType, opts.pcss.options);
  fileList.forEach((file) => {
    const src = file.src;
    const dest = _getPcssDest(context, buildType, file.dest, false);
    if (!src || path.basename(src)[0] === '_') {
      // do nothing if the file name starts with underscore
    } else if (isCcaLiveReload && !_matchChangedCca(src, theme)) {
      // do nothing if the SASS file is not in right CCA for livereload
    } else {
      const fileOpts = {
        file: src,
        outFile: dest
      };
      const finalPcssOpts = Object.assign({}, pcssOpts, fileOpts);
      promiseList.push(_getPcssTaskPromise(finalPcssOpts, context));
      if (buildType === 'release' && util.isCcaSassFile(file.dest)) {
        // We need a second pass to /min for Cca sass release mode
        const fileOpts2 = {
          file: src,
          outFile: _getPcssDest(context, buildType, file.dest, true)
        };
        const finalPcssOpts2 = Object.assign({}, pcssOpts, fileOpts2);
        promiseList.push(_getPcssTaskPromise(finalPcssOpts2, context));
      }
    }
  });
  return promiseList;
}

function _matchChangedCca(filePath, changedCcaTheme) {
  return filePath.indexOf(changedCcaTheme) !== -1;
}

function _getPcssTaskOptions(buildType, defaultPcssOpts) {
  let pcssOpts;
  if (buildType === 'release') {
    pcssOpts = {
      outputStyle: 'compressed'
    };
  } else {
    pcssOpts = {
      outputStyle: 'expanded'
    };
  }
  return Object.assign({}, pcssOpts, defaultPcssOpts);
}

module.exports = {
  getPromises: context => _getPcssPromises(context)
};
