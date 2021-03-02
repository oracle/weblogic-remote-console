// load requirejs.js module from node_modules/requirejs
const requirejs = require('requirejs');

const assert = require('assert');

// configure RequireJS
requirejs.config({
  baseUrl: 'js',
  paths: 
  {
      'knockout': 'libs/knockout/knockout-3.5.1.debug',
      'jquery': 'libs/jquery/jquery-3.5.1',
      'jquery.splitter': 'libs/jquery.splitter/jquery.splitter',
      'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
      'hammerjs': 'libs/hammer/hammer-2.0.36',
      'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2',
      'ojs': 'libs/oj/v9.0.2/debug',
      'ojL10n': 'libs/oj/v9.0.2/ojL10n',
      'ojtranslations': 'libs/oj/v9.0.2/resources',
      'text': 'libs/require/text',
      'signals': 'libs/js-signals/signals',
      'customElements': 'libs/webcomponents/custom-elements.min',
      'proj4': 'libs/proj4js/dist/proj4-src',
      'css': 'libs/require-css/css',
      'touchr': 'libs/touchr/touchr',
      'corejs' : 'libs/corejs/shim',
      'chai': 'libs/chai/chai-4.2.0',
      'regenerator-runtime' : 'libs/regenerator-runtime/runtime',
      'js-yaml' : 'libs/js-yaml/js-yaml.min'
   }
});

//const amdLoader = require('amd-loader');
// const ojs = define('@oracle/oraclejet');
const ojmodel = require('ojs/ojmodel');
const navtreeManager = require('../../viewModels/modules/navtree-manager.js')

function getGreeting(name) {
  return `Hello, ${name}!`;
}

describe("cbe_test ['helloworld']", () => {
  it("#getGreeting(name) should print 'Hello, Anissa and Mason!", () => {
    let greeting = getGreeting("Anissa and Mason");
    console.log(greeting);
    assert.equal(greeting, "Hello, Anissa and Mason!");
  });
});
