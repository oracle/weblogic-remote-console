/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const fs = require('fs-extra');
const { optimize } = require('svgo');
const util = require('./util');
const path = require('path');
const glob = require('glob');
const config = require('./config');
const CONSTANTS = require('./constants');

/**
 * Return the promise to optimize user provided svg files, remove redundant content
 * @param  {Object} Running context that contains all options
 * @returns {Promise} return the promise
 */

function _svgMin(context) {
  const opts = context.opts.svgMin;
  const fileResult = util.getFileList(context.buildType, opts.fileList);
  return new Promise((resolve, reject) => {
    try {
      fileResult.forEach((file) => {
        const src = util.readFileSync(file.src);
        const result = optimize(src, opts.options);
        if (result.error) {
          // The returned result object--which can be of type OptimizedError or
          // OptimizedSvg--includes attributes error (with the error message) and
          // modernError (giving more info about the error--plus the message--and
          // other details like where the error is originated). Therefore, passing
          // result.modernError is more ideal in this case after adding the file
          // causing the error in its message
          // Source: https://unpkg.com/browse/@types/svgo@2.6.3/index.d.ts#L724.
          if (result.modernError) {
            result.modernError.message = `${result.modernError.message} Error caused by file: ${file.src}`;
            reject(result.modernError);
          } else {
            result.error = `${result.error} Error caused by file: ${file.src}`;
            reject(result.error);
          }
        }
        fs.outputFileSync(path.resolve(file.dest), result.data);
      });
      resolve(context);
    } catch (error) {
      reject(error);
    }
  });
}

// Determine if there are any user svg files in given theme
function _hasUserSvg(theme) {
  const themePath = `${config('paths').src.common}/${config('paths').src.themes}/${theme}`;
  const fileList = glob.sync('*/images/*.svg', { cwd: themePath });
  return fileList.length > 0;
}

/**
 * Return the promise to combine user provided svg files into a sprite.svg
 * and update the _oj.common.sprite.scss
 * @param  {Object} Running context that contains all options
 * @returns {Promise} return the promise
 */
function _svgSprite(context) {
  const defaultPadding = 2;
  const opts = context.opts.svgSprite;
  const padding = opts.options.shape.spacing.padding || defaultPadding;
  const defaultTheme = (!util.getInstalledCssPackage()) ?
    CONSTANTS.DEFAULT_THEME : CONSTANTS.DEFAULT_PCSS_THEME;
  const themePath = path.join(`${config('paths').staging.themes}`, defaultTheme);
  const needsSprite = (padding !== defaultPadding) || _hasUserSvg(defaultTheme);
  if (!needsSprite) {
    // Exit
    return Promise.resolve(context);
  }

  return new Promise((resolve, reject) => {
    try {
      util.readDirSync(themePath).forEach((dir) => {
        if (CONSTANTS.SUPPORTED_THEME_PLATFORMS.indexOf(dir) !== -1) {
          if (!util.getInstalledCssPackage()) {
            opts.options.mode = _svgSpriteMode(util.mapToSourceSkinName(dir));
          } else {
            opts.options.mode = _svgPcssSpriteMode(util.mapToPcssSourceSkinName(dir));
          }
          const fileList = glob.sync('images/*.svg', { cwd: path.join(themePath, dir) });
          if (opts.options.shape.spacing.padding) opts.options.shape.spacing.padding = padding;
          let SVGSpriter;
          try {
            SVGSpriter = util.requireLocalFirst('svg-sprite'); // eslint-disable-line
          } catch (e) {
            // No svg-sprite module installed
            util.log.error('svg-sprite module likely not installed but needed for custom .svg files\n\nInstall using "npm install svg-sprite" and rebuild');
          }
          const spriter = new SVGSpriter(opts.options);
          fileList.forEach((file) => {
            if (path.basename(file) !== 'sprite.svg') {
              const fileBase = path.join(themePath, dir);
              spriter.add(path.resolve(file), path.basename(file),
                util.readFileSync(path.resolve(fileBase, file)));
            }
          });
          spriter.compile((error, result) => {
            Object.keys(result).forEach((mode) => {
              Object.keys(result[mode]).forEach((resource) => {
                const output = result[mode][resource];
                const svgDestSuffix = 'images/sprites/sprite.svg';
                let dest;
                let filePrefix;
                if (!util.getInstalledCssPackage()) {
                  dest = path.join(config('paths').staging.themes, CONSTANTS.DEFAULT_THEME, dir, svgDestSuffix);
                } else {
                  dest = path.join(config('paths').staging.themes, CONSTANTS.DEFAULT_PCSS_THEME, dir, svgDestSuffix);
                }
                dest = path.extname(output.path) === '.svg' ? dest : output.path;
                if (!util.getInstalledCssPackage()) {
                  filePrefix = util.mapToSourceSkinName(dir).replace('-', '.');
                } else {
                  filePrefix = util.mapToPcssSourceSkinName(dir).replace('-', '.');
                }
                fs.outputFileSync(dest, output.contents);
                const content = util.readFileSync(dest).replace(/_(?!.+\.svg)/g, '-');
                if (filePrefix !== 'common') {
                  fs.outputFileSync(dest, content.replace(/common\.sprite/g, `${filePrefix}.sprite`));
                } else {
                  fs.outputFileSync(dest, content.replace(/oj-image-url/g, 'oj-common-image-url'));
                }
              });
            });
          });
        }
      });
      resolve(context);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Return the mode configuration for svg spriter
 * @param  {String} Skin name
 * @returns {Object} return the object configuration
 */
function _svgSpriteMode(skin) {
  const filePrefix = skin.replace('-', '.');
  return {
    css: {
      render: {
        scss: {
          template: `${CONSTANTS.PATH_TO_ORACLEJET}/scss/templates/svg-sprite-template.scss.txt`,
          dest: `${CONSTANTS.PATH_TO_ORACLEJET}/scss/${skin}/widgets/_oj.${filePrefix}.sprite.scss`
        }
      },
      layout: 'horizontal',
      dest: '.',
      sprite: 'sprite.svg',
      bust: false,
      example: false
    }
  };
}

/**
 * Return the mode configuration for pcss svg spriter
 * @param  {String} Skin name
 * @returns {Object} return the object configuration
 */
function _svgPcssSpriteMode() {
  return {
    css: {
      render: {
        scss: {
          template: `${CONSTANTS.PATH_TO_ORACLEJET}/scss/templates/svg-sprite-template.scss.txt`,
          dest: `${CONSTANTS.PATH_TO_ORACLEJET}/pcss/oj/${util.getJETVersionV(util.getJETVersion())}/oj/icons/themes/redwood/common/_oj-sprite.scss`
        }
      },
      layout: 'horizontal',
      dest: '.',
      sprite: 'sprite.svg',
      bust: false,
      example: false
    }
  };
}

module.exports = {
  spriteSvg: function _spriteSvg(context) {
    return new Promise((resolve, reject) => {
      try {
        _svgMin(context)
          .then(_svgSprite)
          .then(() => {
            resolve(context);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
};
