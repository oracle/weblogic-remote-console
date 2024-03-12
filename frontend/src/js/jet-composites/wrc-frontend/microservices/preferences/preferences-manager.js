/**
 * @license
 * Copyright (c) 2023, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * @module
 */
define([
    'wrc-frontend/apis/data-operations',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/utils',
    'ojs/ojlogger'
  ],
  function(
    DataOperations,
    Runtime,
    CoreUtils,
    Logger
  ){
    return {
      startup: {
        /**
         *
         * @returns {boolean}
         */
        hasStartupPerspectivePreference: function() {
          const startupPreference = Runtime.getProperty('preferences.startup');
          return (typeof startupPreference !== 'undefined' && typeof startupPreference.perspective !== 'undefined');
        },
        
        /**
         * Returns the ``id`` of the perspective startup preference
         * @returns {string} Id of the perspective startup preference. Default: "configuration"
         */
        startupPerspective: function(){
          let rtnval;
          if (this.hasStartupPerspectivePreference) rtnval = Runtime.getProperty('preferences.startup').perspective;
          return rtnval;
        }
      },

      general: {
        /**
         * Returns flag indicating whether there is a theme preference or not.
         * @returns {boolean}
         */
        hasThemePreference: function() {
          const themePreference = Runtime.getProperty('preferences.general.theme');
          return (typeof themePreference !== 'undefined');
        },

        /**
         * Returns the theme preference for the default application profile.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        loadThemePreference: function() {
          return DataOperations.preferences.getTheme('default');
        },

        /**
         *
         * @param {string} theme
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        saveThemePreference: function(theme) {
          return DataOperations.preferences.setTheme('default', theme);
        },
      },

      notifications: {
        /**
         *
         * @returns {boolean}
         */
        hasPreferences: function() {
          const notificationsPreference = Runtime.getProperty('settings.notifications');
          return (typeof notificationsPreference !== 'undefined');
        },

        /**
         * Returns a shallow copy clone of the ``notification`` settings.
         * @returns {object}
         */
        getPreferences: function() {
          let preferencesClone;
          if (this.hasPreferences()) {
            preferencesClone = Object.assign({}, Runtime.getProperty('settings.notifications'));
          }
          return preferencesClone;
        },

        showPopupForFailureResponsesPreference: function() {
          let rtnval = false;
          if (this.hasPreferences && typeof Runtime.getProperty('settings.notifications').showPopupForFailureResponses !== 'undefined') rtnval = Runtime.getProperty('settings.notifications').showPopupForFailureResponses;
          return rtnval;
        },

        autoCloseInterval: function() {
          let rtnval = 1500;
          if (this.hasPreferences && typeof Runtime.getProperty('settings.notifications').autoCloseInterval !== 'undefined') rtnval = Runtime.getProperty('settings.notifications').autoCloseInterval;
          return rtnval;
        }
      },

      logging: {
        /**
         *
         * @returns {boolean}
         */
        hasPreferences: function() {
          const loggingPreference = Runtime.getProperty('settings.logging');
          return (typeof loggingPreference !== 'undefined');
        },

        /**
         * Returns a shallow copy clone of the ``logging`` preferences.
         * @returns {object}
         */
        getPreferences: function() {
          let preferencesClone;
          if (this.hasPreferences()) {
            preferencesClone = Object.assign({}, Runtime.getProperty('settings.logging'));
          }
          return preferencesClone;
        },

        logFailureResponses: function() {
          let rtnval = true;
          if (this.hasPreferences && typeof Runtime.getProperty('settings.logging').logFailureResponses !== 'undefined') rtnval = Runtime.getProperty('settings.logging').logFailureResponses;
          return rtnval;
        }
      }

    };
  }
);