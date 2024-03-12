/**
 * This is an initialization file which will be loaded into the browser by Karma
 * to configure RequireJS for the test.
 */
var allTestFiles = [];
var TEST_REGEXP = /\w\.spec\.js$/i;
// Variable for JET version used in paths
var JET_VERSION = '15.1.0';

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
    allTestFiles.push('../../' + normalizedTestModule)

  }
}
)

console.log(allTestFiles);

require.config({
  // Karma serves files under /base, which is the basePath from karma.conf.js
  baseUrl: '/base/web/js',

  // Configure RequireJS path mappings
  // Note that every file listed here must also be listed in Karma's "files" array
  paths: {
    'ojs': `libs/oj/${JET_VERSION}/debug`,
    'ojL10n': `libs/oj/${JET_VERSION}/ojL10n`,
    'ojtranslations': `libs/oj/${JET_VERSION}/resources`,
    'knockout': 'libs/knockout/knockout-3.5.1.debug',
    'knockout-mapping': 'libs/knockout/knockout.mapping-latest.debug',
    'jquery': 'libs/jquery/jquery-3.6.4',
    'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.13.2',
    'text': 'libs/require/text',
    'hammerjs': 'libs/hammer/hammer-2.0.8',
    'signals': 'libs/js-signals/signals',
    'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2',
    'css': 'libs/require-css/css.min',
    'css-builder': 'libs/require-css/css-builder',
    'normalize': 'libs/require-css/normalize',
    '@oracle/oraclejet-preact': 'libs/oraclejet-preact/amd',
    'preact': 'libs/preact/dist/preact.umd',
    'preact/hooks': 'libs/preact/hooks/dist/hooks.umd',
    'preact/jsx-runtime': 'libs/preact/jsx-runtime/dist/jsxRuntime.umd',
    'proj4': 'libs/proj4js/dist/proj4-src',
    'touchr': 'libs/touchr/touchr',
    'chai': 'libs/chai/chai-4.3.7',
    'js-yaml' : 'libs/js-yaml/js-yaml',
    // The above fields should match main.js
    'persist': 'libs/persist/debug',
    'sinon': '../../node_modules/sinon/pkg/sinon',
    'promise': 'libs/es6-promise/es6-promise',
    'puppeteer': '../../node_modules/puppeteer/lib/esm/puppeteer',
    'wrc-frontend': 'jet-composites/wrc-frontend/1.0.0'
  },

  // dynamically load all test files
  deps: allTestFiles,

  // start Karma after dependencies have been loaded
  callback: window.__karma__.start
})
