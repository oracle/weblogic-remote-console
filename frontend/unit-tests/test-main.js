/**
 * This is an initialization file which will be loaded into the browser by Karma
 * to configure RequireJS for the test.
 */
var allTestFiles = []
var TEST_REGEXP = /\w\.spec\.js$/i

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

function _ojIsIE11() {
  var nAgt = navigator.userAgent;
  return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
};
var _ojNeedsES5 = _ojIsIE11();

require.config({
  // Karma serves files under /base, which is the basePath from karma.conf.js
  baseUrl: '/base/web/js',

  // Configure RequireJS path mappings
  // Note that every file listed here must also be listed in Karma's "files" array
  paths: {
    "knockout": "libs/knockout/knockout-3.5.1.debug",
    "jquery": "libs/jquery/jquery-3.5.1",
    "jqueryui-amd": "libs/jquery/jqueryui-amd-1.12.1",
    "hammerjs": "libs/hammer/hammer-2.0.36",
    "ojdnd": "libs/dnd-polyfill/dnd-polyfill-1.0.1",
    "ojs": "libs/oj/v10.1.3/debug" + (_ojNeedsES5 ? "_es5" : ""),
    "ojL10n": "libs/oj/v10.1.3/ojL10n",
    "ojtranslations": "libs/oj/v10.1.3/resources",
    "text": "libs/require/text",
    "signals": "libs/js-signals/signals",
    "customElements": "libs/webcomponents/custom-elements.min",
    "proj4": "libs/proj4js/dist/proj4-src",
    "css": "libs/require-css/css",
    "touchr": "libs/touchr/touchr",
    "corejs": "libs/corejs/shim",
    'chai': 'libs/chai/chai-4.2.0',
    "regenerator-runtime": "libs/regenerator-runtime/runtime",
    "js-yaml": "libs/js-yaml/js-yaml",
    // The above fields should match main.js
    "css-builder": "libs/require-css/css-builder",
    "normalize": "libs/require-css/normalize",
    "sinon": "../../node_modules/sinon/pkg/sinon",
    "persist": "libs/persist/debug",
    "promise": "libs/es6-promise/es6-promise",
    "wrc-frontend":"jet-composites/wrc-frontend/1.0.0"
  },

  // dynamically load all test files
  deps: allTestFiles,

  // start Karma after dependencies have been loaded
  callback: window.__karma__.start
})
