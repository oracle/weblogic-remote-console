/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

(function () {
  // noinspection ES6ModulesDependencies
  requirejs.config(
    {
      baseUrl: 'js',

      paths:
      /* DO NOT MODIFY
      ** All paths are dynamicaly generated from the path_mappings.json file.
      ** Add any new library dependencies in path_mappings json file.
      */
      // injector:mainReleasePaths
      {
        'ojs': 'libs/oj/13.0.0/debug',
        'ojL10n': 'libs/oj/13.0.0/ojL10n',
        'ojtranslations': 'libs/oj/13.0.0/resources',
        'knockout': 'libs/knockout/knockout-3.5.1.debug',
        'jquery': 'libs/jquery/jquery-3.6.0',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.13.0',
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
        'preact/compat': 'libs/preact/compat/dist/compat.umd',
        'preact/jsx-runtime': 'libs/preact/jsx-runtime/dist/jsxRuntime.umd',
        'proj4': 'libs/proj4js/dist/proj4-src',
        'touchr': 'libs/touchr/touchr',
        'chai': 'libs/chai/chai-4.3.6',
        'js-yaml' : 'libs/js-yaml/js-yaml'
      }
      // endinjector
      , config: {
        ojL10n: {
          merge: {
            'ojtranslations/nls/ojtranslations': 'resources/nls/frontend'
          }
        }
      }
    }
  );
}());

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback.
 *
 * We include the Runtime module (which is associated with our frontend JET web application, not the JET
 * template) in the require list, because the Runtime module reads the src/config/console-frontend-jet.yaml
 * file to set the default logging level used by ojs/ojlogger. We configure our frontend JET web application
 * to use that instead of the built-in console.log mechanism.
 *
 * The console-project-manager.js module is preloaded to trigger the reading of the "wrc-projects"
 * localStorage object.
 */
require(['ojs/ojcore', 'ojs/ojbootstrap', 'knockout', 'appController', 'ojs/ojrouter', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/project-management/console-project-manager',
    'ojs/ojknockout', 'ojs/ojnavigationlist'],
  function (oj, Bootstrap, ko, app, Router, Runtime) {
    // this callback gets executed when all required modules are loaded
    Bootstrap.whenDocumentReady().then(
      function() {

        function init() {
          Router.sync()
          .then(() => {
            app.loadModule();
            // Bind your ViewModel for the content of the whole page body.
            ko.applyBindings(app, document.getElementById('globalBody'));
          });

          oj.Logger.option('level', Runtime.getLoggingLevel());
        }

        // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
        // event before executing any code that might interact with Cordova APIs or plugins.
        if (document.body.classList.contains('oj-hybrid')) {
          document.addEventListener('deviceready', init);
        } 
        else {
          init();
        }
      });
  }
);
