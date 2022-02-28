/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * NOT REAL!! JUST PART OF A "MOCK" USED TO TRY OUT IDEAS
 * FOR UI PREFERENCES
 */
define(['wrc-frontend/core/parsers/yaml', 'text!wrc-frontend/config/console-preferences.yaml', 'ojs/ojlogger'],
  function(YamlParser, PreferencesFileContents, Logger){
    var preferences = {};

    YamlParser.parse(PreferencesFileContents)
    .then(config => {
      preferences = config;
    })
    .catch((err) => {
      Logger.error(err);
    });

    return {
      startup: {
        /**
         *
         * @returns {boolean}
         */
        hasStartupPerspectivePreference: function() {
          return (typeof preferences.startup !== 'undefined' && typeof preferences.startup.perspective !== 'undefined');
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
      },

      general: {
        /**
         * Returns flag indicating whether there is a theme preference or not.
         * @returns {boolean}
         */
        hasThemePreference: function() {
          return (typeof preferences.general !== 'undefined' && typeof preferences.general.theme !== 'undefined');
        },

        /**
         * Returns the `id` of the theme preference.
         * @returns {string} Id of the theme preference. Default: "light"
         */
        themePreference: function(){
          let rtnval = 'light';
          if (this.hasThemePreference) rtnval = preferences.general.theme;
          return rtnval;
        }
      },

      notifications: {
        /**
         *
         * @returns {boolean}
         */
        hasPreferences: function() {
          return (typeof preferences.notifications !== 'undefined');
        },

        /**
         * Returns a shallow copy clone of the ``notification`` preferences.
         * @returns {object}
         */
        getPreferences: function() {
          let preferencesClone;
          if (this.hasPreferences()) {
            preferencesClone = Object.assign({}, preferences.notifications);
          }
          return preferencesClone;
        },

        showPopupForFailureResponsesPreference: function() {
          let rtnval = false;
          if (this.hasPreferences && typeof preferences.notifications.showPopupForFailureResponses !== 'undefined') rtnval = preferences.notifications.showPopupForFailureResponses;
          return rtnval;
        },

        autoCloseInterval: function() {
          let rtnval = 1500;
          if (this.hasPreferences && typeof preferences.notifications.autoCloseInterval !== 'undefined') rtnval = preferences.notifications.autoCloseInterval;
          return rtnval;
        }
      },

      logging: {
        /**
         *
         * @returns {boolean}
         */
        hasPreferences: function() {
          return (typeof preferences.logging !== 'undefined');
        },

        /**
         * Returns a shallow copy clone of the ``logging`` preferences.
         * @returns {object}
         */
        getPreferences: function() {
          let preferencesClone;
          if (this.hasPreferences()) {
            preferencesClone = Object.assign({}, preferences.logging);
          }
          return preferencesClone;
        },

        logFailureResponses: function() {
          let rtnval = true;
          if (this.hasPreferences && typeof preferences.logging.logFailureResponses !== 'undefined') rtnval = preferences.logging.logFailureResponses;
          return rtnval;
        }
      }

    };

  }
);
