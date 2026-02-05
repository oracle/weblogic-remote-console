/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
const path = require('path');
const util = require('../util');
const hookRunner = require('../hookRunner');
const pathGenerator = require('../rjsConfigGenerator');
const CONSTANTS = require('../constants');
const ojetUtils = require('../util');

let webpack;
let WebpackRequireFixupPlugin;

module.exports = function (context) {
  // eslint-disable-next-line global-require, import/newline-after-import, import/no-dynamic-require
  webpack = util.requireLocalFirst('webpack');
  const requireFixupPluginPath = path.join(
    util.getOraclejetPath(),
    CONSTANTS.WEBPACK_TOOLS_PATH,
    'plugins/WebpackRequireFixupPlugin'
  );
  // eslint-disable-next-line global-require, import/newline-after-import, import/no-dynamic-require
  WebpackRequireFixupPlugin = require(requireFixupPluginPath);
  // eslint-disable-next-line no-param-reassign
  context.opts.webpack = {
    config: _createConfig(context)
  };
  return hookRunner('before_webpack', context)
    .then(_runWebpack);
};

function _createConfig(context) {
  const configPaths = util.getConfiguredPaths();
  const oraclejetConfig = util.getOraclejetConfigJson();
  const entryFile = oraclejetConfig.architecture === CONSTANTS.VDOM_ARCHITECTURE ? 'index.js' : 'root.js';
  const bundleName = util.getBundleName().full;

  // use polyfill for chai unless it's resolvable
  let chai = false; // eslint-disable-line
  try {
    chai = require.resolve('chai');
  } catch (ex) {} // eslint-disable-line

  return {
    entry: path.resolve(context.opts.stagingPath, configPaths.src.javascript, entryFile),
    mode: 'production',
    output: {
      filename: bundleName,
      path: path.resolve(context.opts.stagingPath, configPaths.src.javascript)
    },
    resolveLoader: {
      modules: ['node_modules', path.join(util.getOraclejetPath(), CONSTANTS.WEBPACK_TOOLS_PATH, 'loaders')],
      alias: {
        ojL10n: 'ojL10n-loader',
        text: 'text-loader',
        css: 'style-loader',
        ojcss: 'style-loader'
      }
    },
    resolve: {
      alias: _createPathMappings(context),
      fallback: { chai }
    },
    module: {
      rules: [
        {
          test: /\.json$/,
          use: [],
          type: 'javascript/auto'
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'css-fix-url-loader',
              // There is no path to images/../../redwood/images/<avatar[id].png>.
              // Enable webpack to resolve it as images/<avatar[id].png>.
              options: {
                from: './images',
                to: '../../../../../../images',
              }
            },
            {
              loader: 'css-fix-url-loader',
              // There is no 'images' folder under the created theme's folder.
              // Redirect the path to the alta's images subfolder.
              options: {
                from: 'images/animated-overlay.gif',
                to: `../../../alta/${ojetUtils.getJETVersion()}/common/images/animated-overlay.gif`,
              }
            },
            // There is no path to ../../css/redwood/images/AI-Sparkle.gif.
            // Configure webpack to resolve it as ./images/AI-Sparkle.gif.
            {
              loader: 'css-fix-url-loader',
              options: {
                from: '../../css/redwood/images/AI-Sparkle.gif',
                to: './images/AI-Sparkle.gif',
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          ojL10nLoader: {
            locale: 'en-US'
          }
        }
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new WebpackRequireFixupPlugin({
        ojModuleResources: {
          root: path.resolve(context.opts.stagingPath, configPaths.src.javascript),
          view: {
            prefix: 'text!',
            match: '^\\./views/.+\\.html$'
          },
          viewModel: {
            match: '^\\./viewModels/.+\\.js$',
            addExtension: '.js'
          }
        },
        baseResourceUrl: path.join(context.opts.stagingPath, configPaths.src.javascript, 'libs/oj', `v${util.getJETVersion()}`)
      })
    ]
  };
}

function _createPathMappings(context) {
  const configPaths = util.getConfiguredPaths();
  const pathMappings = {};
  const defaultPathMappings = pathGenerator.getPathsMapping(context, true);
  Object
    .keys(defaultPathMappings)
    .forEach((key) => {
      pathMappings[key] = path.resolve(
        context.opts.stagingPath,
        configPaths.src.javascript,
        defaultPathMappings[key]
      );
    });
  // We have both single-level multi-level path mappings for preact e.g.
  // "preact" and "preact/hooks", "preact/debug" etc. For webpack, we need
  // to define the single-level "preact" mapping with the "$" suffix so that
  // "preact/*" imports are not resolved to "preact";
  if (pathMappings.preact) {
    pathMappings.preact$ = pathMappings.preact;
    delete pathMappings.preact;
  }
  return pathMappings;
}

function _runWebpack(context) {
  return new Promise((resolve, reject) => {
    util.log('Running webpack');
    const { config } = context.opts.webpack;
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        reject(err.details);
      }
      console.log(stats.toString());
      resolve(context);
    });
  });
}
