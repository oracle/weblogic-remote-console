/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'wrc-frontend/core/parsers/yaml',
  'text!wrc-frontend/config/app-profile.yaml',
  './app-profile',
  'wrc-frontend/apis/data-operations',
  'ojs/ojlogger'
],
function (
  YamlParser,
  AppProfileFileContents,
  AppProfile,
  DataOperations,
  Logger
) {
    let schema = {}, profiles = [];

    function createAppProfile(entry) {
      const profile = new AppProfile(entry.id, entry.isDefault, entry.isPrivate);
      for (const tab of entry.tabs) {
        profile.addTab(profile, tab.id, tab.sections, schema);
        profiles.push(profile);
      }
    }

    function convertToProfileFields(profile) {
      const profileFields = {id: profile.id, isDefault: profile.isDefault, isPrivate: profile.isPrivate};
      for (const tab of profile.tabs) {
        for (const section of tab.sections) {
          for (const field of section.fields) {
            if (field.value) profileFields[field.name] = field.value;
          }
        }
      }
      return profileFields;
    }

    YamlParser.parse(AppProfileFileContents)
      .then(config => {
        const appProfileTemplate = {};
        if (config['schema']) {
          schema = config['schema'];
          if (config['profiles']) {
            if (Array.isArray(config['profiles'])) {
              for (const entry of config['profiles']) {
                createAppProfile(entry);
              }
            }
          }
        }
      })
      .catch((err) => {
        Logger.error(err);
      });
    
    return {
      getSchemaTabs: () => {
        return schema.tabs.filter(tab => tab.visible).map(({id}) => id);
      },
      /**
       *
       * @param {string} id
       * @returns {AppProfile}
       */
      getAppProfile: (id) => {
        return profiles.find(item => item.id === id);
      },
      loadAppProfile: (id) => {
        return DataOperations.profile.load(id);
      },
      saveAppProfile: (dialogFields) => {
        const profile = {
          id: dialogFields.id(),
          general: {
            account: {
              organization: dialogFields.general.account.organization(),
              name: dialogFields.general.account.name(),
              email: dialogFields.general.account.email()
            },
            role: {
              isDefault: dialogFields.general.role.isDefault(),
              isPrivate: dialogFields.general.role.isPrivate()
            }
          },
          settings: {
            disableHNV: dialogFields.settings.disableHNV(),
            startupTaskChooserType: dialogFields.settings.startupTaskChooserType(),
            networking: {
              proxyAddress: dialogFields.settings.proxyAddress()
            },
            security: {
              trustStoreType: dialogFields.settings.trustStoreType(),
              trustStorePath: dialogFields.settings.trustStorePath(),
              trustStoreKey: dialogFields.settings.trustStoreKey()
            },
            timeouts: {
              connectionTimeout: dialogFields.settings.connectionTimeout(),
              readTimeout: dialogFields.settings.readTimeout()
            }
          },
          imageDataUrl: dialogFields.imageDataUrl(),
          preferences: {
            useCredentialStorage: dialogFields.preferences.useCredentialStorage(),
            confirmations: {
              onQuit: dialogFields.preferences.onQuit(),
              onDelete: dialogFields.preferences.onDelete()
            },
            popups: {
              onActionNotAllowed: dialogFields.preferences.onActionNotAllowed(),
              onUnsavedChangesDetected: dialogFields.preferences.onUnsavedChangesDetected(),
              onChangesNotDownloaded: dialogFields.preferences.onChangesNotDownloaded()
            }
          },
          properties: {
            javaSystemProperties: dialogFields.properties.javaSystemProperties()
          }
        };
        return DataOperations.profile.save(profile.id, profile, true);
      },
      getAppProfiles: (defaultImageDataUrl) => {
        return DataOperations.profile.getList(defaultImageDataUrl);
      },
      /**
       *
       * @param {string} id
       * @param {AppProfile} profile
       */
      createAppProfile: (id, profile) => {
      
      },
      replaceAppProfileImage: (id, file) => {
        return DataOperations.profile.replaceImage(id, file);
      },
      clearAppProfileImage: (id) => {
        return DataOperations.profile.clearImage(id);
      },
      updateAppProfile: (id, profileFields) => {
        return DataOperations.profile.update(id, profileFields);
      },
      removeAppProfile: (id) => {
        return DataOperations.profile.remove(id);
      },
      activateAppProfile: (id) => {
        return DataOperations.profile.activate(id);
      },
      getCurrentAppProfile: () => {
        return DataOperations.profile.loadCurrent();
      },
      setCurrentAppProfile: (id) => {
        return DataOperations.profile.setCurrent(id);
      },
      getDefaultAppProfile: () => {
        return DataOperations.profile.getDefault();
      }
    };
  }
);
