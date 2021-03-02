/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', '../../cfe/cbe-types', '../../cfe/common/runtime', '../../cfe/http/adapter', './pdj-messages', 'ojs/ojlogger'],
  function (ko, CbeTypes, Runtime, HttpAdapter, PageDefinitionMessages, Logger) {
    const i18n = {
      messages: {
        "serviceNotDefined": {detail: "'{0}' service not defined in console-frontend-jet.yaml file."},
        "cannotGetLockState": {summary: "Unable to access change manager!"},
        "changesCommitted": {summary: "Changes were successfully committed!"},
        "changesNotCommitted": {summary: "Unable to commit changes!"},
        "changesDiscarded":  {summary: "Changes were successfully discarded!"},
        "changesNotDiscarded": {summary: "Unable to discard changes!"},
        "seeJavascriptConsole": {detail: "See remote console terminal or Javascript console for specific reason(s)."}
      }
    };

    var properties = {};

    function getServiceConfigComponentURL(id){
      const serviceConfig = Runtime.getServiceConfig(CbeTypes.ServiceType.CONFIGURING);
      if (typeof serviceConfig === "undefined") throw new Error(i18n.messages.serviceNotDefined.replace("{0}", CbeTypes.ServiceType.CONFIGURING.name));
      const component = serviceConfig.components.changeManager.find(item => item.id === id);
      return Runtime.getBaseUrl() + serviceConfig.path + component.uri;
    }

    function computeHasChanges(changeManager) {
      return (typeof changeManager.hasChanges !== "undefined" ? changeManager.hasChanges : false);
    }

    function computeSupportsChanges(changeManager) {
      return (typeof changeManager.supportsChanges !== "undefined" ? changeManager.supportsChanges : false);
    }

    function computeIsLockOwner(changeManager) {
      let isLockOwner = false;
      if (typeof changeManager.lockOwner !== "undefined") {
        isLockOwner = (Runtime.getWebLogicUsername() === changeManager.lockOwner);
      }
      return isLockOwner;
    }

  //public:
    return {
      Section:  Object.freeze({
        CHANGE_MANAGER: {name: "changeManager"},
        ADDITIONS: {name: "additions"},
        MODIFICATIONS: {name: "modifications"},
        REMOVALS: {name: "removals"},
        RESTART: {name: "restart"}
      }),
      Property: Object.freeze({
        HAS_CHANGES: {name: "hasChanges"},
        IS_LOCK_OWNER: {name: "isLockOwner"},
        LOCK_OWNER: {name: "lockOwner"},
        LOCKED: {name: "locked"},
        MERGE_NEEDED: {name: "mergeNeeded"},
        WLS_CONFIG_VERSION: {name: "weblogicConfigurationVersion"},
        SUPPORTS_CHANGES: {name: "supportsChanges"}
      }),
      Entity: Object.freeze({
        SHOPPING_CART: {name: "shoppingcart"}
      }),
      getLockState: function getLockState(signal) {
        return new Promise((resolve, reject) => {
          const changeManagerURL = getServiceConfigComponentURL("view");

          HttpAdapter.get(changeManagerURL)
          .then((data) => {
            data.changeManager[this.Property.IS_LOCK_OWNER.name] = computeIsLockOwner(data.changeManager);
            data.changeManager[this.Property.HAS_CHANGES.name] = computeHasChanges(data.changeManager);
            data.changeManager[this.Property.SUPPORTS_CHANGES.name] = computeSupportsChanges(data.changeManager);
            properties = data.changeManager;
            resolve(data);
          })
          .catch((response) => {
            this.putMostRecent({
              "isLockOwner": false,
              "hasChanges": false,
              "supportsChanges": false
            });
            response.json()
            .then((responseBody) => {
              signal.dispatch({severity: 'confirmation', summary: i18n.messages.cannotGetLockState.summary, detail: i18n.messages.seeJavascriptConsole.detail});
              Logger.error(responseBody);
              reject(responseBody);
            });
          });
        });
      },
      getMostRecent: function getMostRecent() {
        return properties;
      },
      putMostRecent: function putMostRecent(changeManager) {
        changeManager[this.Property.IS_LOCK_OWNER.name] = computeIsLockOwner(changeManager);
        changeManager[this.Property.HAS_CHANGES.name] = computeHasChanges(changeManager);
        changeManager[this.Property.SUPPORTS_CHANGES.name] = computeSupportsChanges(changeManager);
        properties = changeManager;
      },
      getData: function getData() {
        return new Promise((resolve, reject) => {
          const changeManagerURL = getServiceConfigComponentURL("edit");

          HttpAdapter.get(changeManagerURL)
          .then((data) => {
            data.changeManager[this.Property.IS_LOCK_OWNER.name] = computeIsLockOwner(data.changeManager);
            data.changeManager[this.Property.HAS_CHANGES.name] = computeHasChanges(data.changeManager);
            data.changeManager[this.Property.SUPPORTS_CHANGES.name] = computeSupportsChanges(data.changeManager);
            this.putMostRecent(data.changeManager);
            resolve(data);
          })
          .catch((response) => {
            if (response.status >= 400) {
              this.putMostRecent({
                "isLockOwner": false,
                "hasChanges": false,
                "supportsChanges": false
              });
              response.json()
              .then((responseBody) => {
                Logger.warn(JSON.stringify(responseBody.messages));
              });
              const data = {
                changeManager: this.getMostRecent(),
                data: {
                  additions: [],
                  modifications: [],
                  removals: [],
                  restart: []
                }
              };
              resolve(data);
            }
          });
        });
      },
      getSection: function getSection(data, name){
        let section;
        if (typeof name !== "undefined") {
          if (typeof name.name !== "undefined") {
            section = data[name.name];
          }
          else if (typeof name === "string" && name.length > 0) {
            section = data[name];
          }
        }
        return section;
      },
      commitChanges: function commitChanges(signal) {
        return new Promise((resolve) => {
          const changeManagerURL = getServiceConfigComponentURL("commit");
          HttpAdapter.post(changeManagerURL, {})
          .then((data) => {
            this.putMostRecent({
              "isLockOwner": properties.isLockOwner,
              "hasChanges": false,
              "supportsChanges": properties.supportsChanges
            });
            signal.dispatch({severity: 'confirmation', summary: i18n.messages.changesCommitted.summary});
            resolve(this.getMostRecent());
          })
          .catch((response) => {
            response.json()
            .then((responseBody) => {
              signal.dispatch({severity: 'confirmation', summary: i18n.messages.changesNotCommitted.summary, detail: i18n.messages.seeJavascriptConsole.detail}, 5000);
              Logger.error(JSON.stringify(responseBody.messages));
            });
            resolve(this.getMostRecent());
          });
        });
      },
      discardChanges: function discardCharges(signal) {
        return new Promise((resolve) => {
          const changeManagerURL = getServiceConfigComponentURL("discard");
          HttpAdapter.post(changeManagerURL, {})
          .then((data) => {
            this.putMostRecent({
              "isLockOwner": properties.isLockOwner,
              "hasChanges": false,
              "supportsChanges": properties.supportsChanges
            });
            signal.dispatch({severity: 'confirmation', summary: i18n.messages.changesDiscarded.summary});
            resolve(this.getMostRecent());
          })
          .catch((response) => {
            response.json()
            .then((responseBody) => {
              signal.dispatch({severity: 'confirmation', summary: i18n.messages.changesNotDiscarded.summary, detail: i18n.messages.seeJavascriptConsole.detail}, 5000);
              Logger.error(JSON.stringify(responseBody.messages));
            });
            resolve(this.getMostRecent());
          });
        });
      }

    };

  }
);