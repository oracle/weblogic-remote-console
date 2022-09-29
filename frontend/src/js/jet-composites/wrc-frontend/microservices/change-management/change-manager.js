/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/provider-management/data-provider-manager','wrc-frontend/core/runtime', 'wrc-frontend/core/cbe-types', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, ko, DataOperations, MessageDisplaying, DataProviderManager, Runtime, CbeTypes, CoreTypes, CoreUtils, Logger) {
    const i18n = {
      messages: {
        'cannotGetLockState': {summary: oj.Translations.getTranslatedString('wrc-change-manager.messages.cannotGetLockState.summary')},
        'changesCommitted': {summary: oj.Translations.getTranslatedString('wrc-change-manager.messages.changesCommitted.summary')},
        'changesNotCommitted': {summary: oj.Translations.getTranslatedString('wrc-change-manager.messages.changesNotCommitted.summary')},
        'changesDiscarded':  {summary: oj.Translations.getTranslatedString('wrc-change-manager.messages.changesDiscarded.summary')},
        'changesNotDiscarded': {summary: oj.Translations.getTranslatedString('wrc-change-manager.messages.changesNotDiscarded.summary')}
      }
    };

    var properties = {};

    function computeHasChanges(changeManager) {
      return (CoreUtils.isNotUndefinedNorNull(changeManager.hasChanges) ? changeManager.hasChanges : false);
    }

    function computeSupportsChanges(changeManager) {
      return (CoreUtils.isNotUndefinedNorNull(changeManager.supportsChanges) ? changeManager.supportsChanges : false);
    }

    function computeIsLockOwner(changeManager) {
      let isLockOwner = false;
      if (CoreUtils.isNotUndefinedNorNull(changeManager.lockOwner)) {
        isLockOwner = (Runtime.getWebLogicUsername() === changeManager.lockOwner);
      }
      return isLockOwner;
    }

    //public:
    return {
      /** @type {{CHANGE_MANAGER: {name: string}, ADDITIONS: {name: string}, MODIFICATIONS: {name: string}, REMOVALS: {name: string}, RESTART: {name: string}}} */
      Section:  Object.freeze({
        CHANGE_MANAGER: {name: 'changeManager'},
        ADDITIONS: {name: 'additions'},
        MODIFICATIONS: {name: 'modifications'},
        REMOVALS: {name: 'removals'},
        RESTART: {name: 'restart'}
      }),
      /** @type {{HAS_CHANGES: {name: string}, IS_LOCK_OWNER: {name: string}, LOCK_OWNER: {name: string}, LOCKED: {name: string}, MERGE_NEEDED: {name: string}, WLS_CONFIG_VERSION: {name: string}, SUPPORTS_CHANGES: {name: string}}} */
      Property: Object.freeze({
        HAS_CHANGES: {name: 'hasChanges'},
        IS_LOCK_OWNER: {name: 'isLockOwner'},
        LOCK_OWNER: {name: 'lockOwner'},
        LOCKED: {name: 'locked'},
        MERGE_NEEDED: {name: 'mergeNeeded'},
        WLS_CONFIG_VERSION: {name: 'weblogicConfigurationVersion'},
        SUPPORTS_CHANGES: {name: 'supportsChanges'}
      }),
      /** @type {{SHOPPING_CART: {name: string}}} */
      Entity: Object.freeze({
        SHOPPING_CART: {name: 'shoppingcart'}
      }),
      /**
       * @param {"edit"|"serverConfig"|"domainRuntime"|"securityData"|"compositeConfig"|"propertyList"} beanTreeName
       * @returns {Promise<any>}
       */
      getLockState: function (beanTreeName) {
        return new Promise((resolve, reject) => {
          const dataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isUndefinedOrNull(dataProvider)) {
            this.putMostRecent({
              'isLockOwner': false,
              'hasChanges': false,
              'supportsChanges': false
            });
            const response = {
              body: {
                data: {
                  changeManager: this.getMostRecent()
                }
              }
            };
            resolve(response.body.data);
          }
          else {
            const uri = dataProvider.getBeanTreeChangeManagerUri(beanTreeName);
            if (CoreUtils.isNotUndefinedNorNull(uri)) {
              DataOperations.changeManager.getLockState(uri)
                .then(reply => {
                  reply.body.data.changeManager[this.Property.IS_LOCK_OWNER.name] = computeIsLockOwner(reply.body.data.changeManager);
                  reply.body.data.changeManager[this.Property.HAS_CHANGES.name] = computeHasChanges(reply.body.data.changeManager);
                  reply.body.data.changeManager[this.Property.SUPPORTS_CHANGES.name] = computeSupportsChanges(reply.body.data.changeManager);
                  properties = reply.body.data.changeManager;
                  resolve(reply.body.data);
                })
                .catch(response => {
                  this.putMostRecent({
                    'isLockOwner': false,
                    'hasChanges': false,
                    'supportsChanges': false
                  });
                  if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                    // If transport.status of response is 403 (Forbidden)
                    // it means we're in STANDALONE mode, and the end
                    // user hasn't made a domain connection, yet. The
                    // transport layer has already logged the error to
                    // the JavaScript Console, so we can just return a
                    // fulfilled Promise containing the response body.
                    if (response.transport.status === 403) {
                      response.body.data = {
                        changeManager: this.getMostRecent()
                      };
                      resolve(response.body.data);
                    }
                    else {
                      // Rethrow reject.
                      reject(response);
                    }
                  }
                  else {
                    // It's a failure caused by JavaScript,
                    // so rethrow the reject.
                    reject(response);
                  }
                });

            }
            else {
              this.putMostRecent({
                'isLockOwner': false,
                'hasChanges': false,
                'supportsChanges': false
              });
              resolve({changeManager: this.getMostRecent()});
            }
          }
        });
      },
      getMostRecent: function () {
        return properties;
      },
      putMostRecent: function putMostRecent(changeManager) {
        changeManager[this.Property.IS_LOCK_OWNER.name] = computeIsLockOwner(changeManager);
        changeManager[this.Property.HAS_CHANGES.name] = computeHasChanges(changeManager);
        changeManager[this.Property.SUPPORTS_CHANGES.name] = computeSupportsChanges(changeManager);
        properties = changeManager;
      },
      getData: function () {
        return new Promise((resolve) => {
          const dataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            DataOperations.changeManager.getData(dataProvider.getBeanTreeChangeManagerUri())
              .then(reply => {
                reply.body.data.changeManager[this.Property.IS_LOCK_OWNER.name] = computeIsLockOwner(reply.body.data.changeManager);
                reply.body.data.changeManager[this.Property.HAS_CHANGES.name] = computeHasChanges(reply.body.data.changeManager);
                reply.body.data.changeManager[this.Property.SUPPORTS_CHANGES.name] = computeSupportsChanges(reply.body.data.changeManager);
                this.putMostRecent(reply.body.data.changeManager);
                resolve(reply.body.data);
              })
              .catch(response => {
                if (!response.succeeded) {
                  this.putMostRecent({
                    'isLockOwner': false,
                    'hasChanges': false,
                    'supportsChanges': false
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
          }
        });
      },
      getSection: function (data, name){
        let section;
        if (typeof name !== 'undefined') {
          if (typeof name.name !== 'undefined') {
            section = data[name.name];
          }
          else if (typeof name === 'string' && name.length > 0) {
            section = data[name];
          }
        }
        return section;
      },
      commitChanges: function () {
        return new Promise((resolve) => {
          const dataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            DataOperations.changeManager.commitChanges(dataProvider.getBeanTreeChangeManagerUri())
              .then(reply => {
                this.putMostRecent({
                  'isLockOwner': properties.isLockOwner,
                  'hasChanges': false,
                  'supportsChanges': properties.supportsChanges
                });
                MessageDisplaying.displayMessage({severity: 'confirmation', summary: i18n.messages.changesCommitted.summary, detail: ''});
                resolve(this.getMostRecent());
              })
              .catch(response => {
                MessageDisplaying.displayResponseMessages(response.body.messages, 5000);
                Logger.error(response.failureReason);
                resolve(this.getMostRecent());
              });
          }
        });
      },
      discardChanges: function () {
        return new Promise((resolve) => {
          const dataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            DataOperations.changeManager.discardChanges(dataProvider.getBeanTreeChangeManagerUri())
              .then(reply => {
                this.putMostRecent({
                  'isLockOwner': properties.isLockOwner,
                  'hasChanges': false,
                  'supportsChanges': properties.supportsChanges
                });
                MessageDisplaying.displayMessage({severity: 'confirmation', summary: i18n.messages.changesDiscarded.summary, detail: ''});
                resolve(this.getMostRecent());
              })
              .catch(response => {
                MessageDisplaying.displayResponseMessages(response.body.messages, 5000);
                Logger.error(response.failureReason);
                resolve(this.getMostRecent());
              });
          }

        });
      }

    };

  }
);
