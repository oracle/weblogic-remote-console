/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * NOT REAL!! JUST PART OF A "MOCK" USED TO TRY OUT IDEAS
 * FOR UI PREFERENCES
 */
define(['../../io/adapter', 'ojs/ojlogger', '../../common/utils'],
  function(FileAdapter, Logger, Utils){
    var preferences = {};

    FileAdapter.readYaml('config/console-preferences.yaml')
    .then((config) => {
      preferences = config;
    })
    .catch((err) => {
      Logger.error(err);
    });

    return {
      /**
       * Returns flag indicating whether there is a theme preference or not.
       * @returns {boolean}
       */
      hasThemePreference: function() {
        return (typeof preferences.general !== "undefined" && typeof preferences.general.theme !== "undefined");
      },

      /**
       *
       * @returns {boolean}
       */
      hasStartupPerspectivePreference: function() {
        return (typeof preferences.startup !== "undefined" && typeof preferences.startup.perspective !== "undefined");
      },

      /**
       * Returns the `id` of the theme preference.
       * @returns {string} Id of the theme preference. Default: "light"
       */
      themePreference: function(){
        let rtnval = "light";
        if (this.hasThemePreference) rtnval = preferences.general.theme;
        return rtnval;
      },

      /**
       * Returns the ``id`` of the perspective startup preference
       * @returns {string} Id of the perspective startup preference. Default: "configuration"
       */
      startupPerspective: function(){
        let rtnval;
        if (this.hasStartupPerspectivePreference) rtnval = preferences.startup.perspective;
        return rtnval;
      }
    };

  }
);
