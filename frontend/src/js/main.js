/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

 // The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function () {
  
  function _ojIsIE11() {
    var nAgt = navigator.userAgent;
    return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
  }
  var _ojNeedsES5 = _ojIsIE11();

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
        'knockout': 'libs/knockout/knockout-3.5.1.debug',
        'jquery': 'libs/jquery/jquery-3.5.1',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
        'hammerjs': 'libs/hammer/hammer-2.0.36',
        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2',
        'ojs': 'libs/oj/v9.1.0/debug' + (_ojNeedsES5 ? '_es5' : ''),
        'ojL10n': 'libs/oj/v9.1.0/ojL10n',
        'ojtranslations': 'libs/oj/v9.1.0/resources',
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
      //endinjector
      , config: {
        ojL10n: {
          merge: {
            'ojtranslations/nls/ojtranslations': 'resources/nls/frontend'
          }
        }
      }
    });
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

          oj.Logger.option("level", Runtime.getLoggingLevel());
        }

        // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
        // event before executing any code that might interact with Cordova APIs or plugins.
        if (document.body.classList.contains('oj-hybrid')) {
          document.addEventListener("deviceready", init);
        } 
        else {
          init();
        }
      });
  }
);
