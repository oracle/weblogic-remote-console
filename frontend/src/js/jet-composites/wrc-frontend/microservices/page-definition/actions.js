/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/microservices/data-management/cbe-data-manager', 'wrc-frontend/core/runtime', './fields', './utils', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors','ojs/ojlogger'],
  function (oj, ko, CbeDataManager, Runtime, PageDefinitionFields, PageDefinitionUtils, CoreTypes,  CoreUtils, CfeErrors, Logger) {
    function PageDefinitionActions(pdjActions, rdjData) {
      if (CoreUtils.isNotUndefinedNorNull(pdjActions) && CoreUtils.isNotUndefinedNorNull(rdjData)) {
        this.pdjData = {actions: pdjActions};
        this.rdjData = rdjData;

        if (CoreUtils.isNotUndefinedNorNull(this.pdjData.actions[0]) && this.pdjData.actions[0].name === 'startActions') {
          this.pdjData.actions[0].name = 'start';
        }

        if (CoreUtils.isNotUndefinedNorNull(this.pdjData.actions[1]) && this.pdjData.actions[1].name === 'stopActions') {
          this.pdjData.actions[1].name = 'stop';
        }

        if (CoreUtils.isNotUndefinedNorNull(this.pdjData.actions[2]) && this.pdjData.actions[2].name === 'suspendActions') {
          this.pdjData.actions[2].name = 'suspend';
          this.pdjData.actions[2].actions[0].name = 'gracefulSuspend';
        }

        if (CoreUtils.isNotUndefinedNorNull(this.pdjData.actions[3]) && this.pdjData.actions[3].name === 'shutdownActions') {
          this.pdjData.actions[3].name = 'shutdown';
        }

        const filteredActions = getSupportedActionsByState.call(this, {value: 'SHUTDOWN'});
        Logger.info(`[PDJACTIONS] getSupportedActionsByState({value: "SHUTDOWN"})=${JSON.stringify(filteredActions)}`);
      }
      else {
        if (CoreUtils.isUndefinedOrNull(pdjActions)) Logger.log('[PDJACTIONS] Constructor parameter is undefined: pdjActions');
        if (CoreUtils.isUndefinedOrNull(rdjData)) Logger.log('[PDJACTIONS] Constructor parameter is undefined: rdjData');
      }
    }

    const i18n = {
      messages: {
        'action': {
          'unableToPerform': {
            summary: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.unableToPerform.summary'),
            detail: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.unableToPerform.detail', '{0}', '{1}')
          }
        }
      },
      labels: {
        'cannotDetermineExactCause': {value: oj.Translations.getTranslatedString('wrc-pdj-actions.labels.cannotDetermineExactCause.value')}
      }
    };

    const SUPPORTED_ACTIONS = Object.freeze({
      'start': {iconFile: 'action-start-icon-blk_24x24', visible: true, disabled: false},
      'resume': {iconFile: 'action-resume-icon-blk_24x24', visible: true, disabled: false},
      'suspend': {iconFile: 'action-suspend-icon-blk_24x24', visible: true, disabled: false},
      'shutdown': {iconFile: 'action-stop-icon-blk_24x24', visible: true, disabled: false},
      'restartSSL': {iconFile: 'action-restart-icon-blk_24x24', visible: true, disabled: false},
      'stop': {iconFile: 'action-stop-icon-blk_24x24', visible: true, disabled: false}
    });

    /**
     *
     * @param {string} action
     * @returns {{data: [{actions: [{name: string, label: string, asynchronous: boolean, usedIf: {property: string, values: [string]}}], identity: {value: {label: string, resourceData: string}}}]}}
     * @private
     * @example
     * convertedData.data = [
     * {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "ManagedServer1", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/ManagedServer1"}}},
     * {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "ManagedServer2", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/ManagedServer2"}}},
     * {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "ManagedServer3", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/ManagedServer3"}}},
     * {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "server1", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/server1"}}},
     * {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "server2", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/server2"}}}
     * ]
     */
    function getConvertedData(action) {
      const convertedData = {};
      const filteredData = getFilteredData.call(this, this.rdjData.data);
      convertedData['data'] = filteredData.filter(data => data.actions.map(action1 => action1.name).indexOf(action) !== -1);
      return convertedData;
    }

    /**
     *
     * @param {[{Name: {value: string}, State: {value: string}, Type: {value: string}, identity: {value: {label: string, resourceData: string}}}]} data
     * @returns {[{actions: [Array], identity: {value: {label: string, resourceData: string}}}]}
     */
    function getFilteredData(data) {
      let filteredData = [], filteredActions;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (CoreUtils.isNotUndefinedNorNull(data[i].State)) {
            filteredActions = getSupportedActionsByState.call(this, data[i].State);
            if (filteredActions.length > 0) {
              filteredData.push({actions: filteredActions, identity: data[i].identity});
            }
          }
          else {
            filteredActions = getAllActions.call(this);
            if (filteredActions.length > 0) {
              filteredData.push({actions: filteredActions, identity: data[i].identity});
            }
          }
        }
      }
      return filteredData;
    }

    function getTargetMBean() {
      let targetMBean;
      if (this.hasActions()) {
        const pageDescription = this.rdjData.pageDescription;
        targetMBean = pageDescription.substring(pageDescription.lastIndexOf('/') + 1, pageDescription.indexOf('?'));
      }
      return targetMBean;
    }

    function getDataByAction(action) {
      let filteredData = [];
      if (this.hasActions()) {
        const convertedData = getConvertedData.call(this, action);
        // convertedData.data is an array that should
        // look something like the following:
        //
        // [
        //  {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "ManagedServer1", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/ManagedServer1"}}},
        //  {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "ManagedServer2", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/ManagedServer2"}}},
        //  {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "ManagedServer3", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/ManagedServer3"}}},
        //  {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "server1", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/server1"}}},
        //  {actions: [{name: "start", label: "Start", asynchronous: true, usedIf: {property: "State", values: ["SHUTDOWN", "ACTIVATE_LATER", "FAILED_MIGRATABLE", "FAILED_NOT_RESTARTABLE", "UNKNOWN"]}}], identity: {value: {label: "server2", resourceData: "/api/1631352147961/domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/server2"}}}
        // ]
        //
        filteredData = convertedData.data.filter(data => data.actions.map(action1 => action1.name).indexOf(action) !== -1);
      }
      return filteredData;
    }

    /**
     * Returns the number of items in the ``this.rdjData.data`` array, which are currently in a ``State`` that supports performing the specified ``action``.
     * @param {string} action
     * @returns {number}
     * @private
     */
    function getDataActionsCount(action) {
      let filteredData = getDataByAction.call(this, action);
      let count = filteredData.length;
      if (count === 0) {
        const filteredActions = this.pdjData.actions.filter(action1 => action1.name === action && CoreUtils.isNotUndefinedNorNull(action1.actions));
        for (let i = 0; i < filteredActions.length; i++) {
          for (let j = 0; j < filteredActions[i].actions.length; j++){
            filteredData = getDataByAction.call(this, filteredActions[i].actions[j].name);
            count += (filteredData.length > 0 ? 1 : 0);
          }
        }
      }
      return count;
    }

    /**
     *
     * @param {[{Name: {value: string}, State: {value: string}, Type: {value: string}, identity: {value: {label: string, resourceData: string}}}]} data
     * @return {object}
     * @private
     */
    function getDataActionsMap(data) {
      const actionsMap = {};
      for (let i = 0; i < data.actions.length; i++) {
        actionsMap[data.actions[i].name] = data.identity;
      }
      return actionsMap;
    }

    function getActionsDialogData(action) {
        let options = [], urls = [];
        if (this.hasActions()) {
          const filteredData = getDataByAction.call(this, action);
          // Workaround for CBE enhancement to use "gracefulSuspend"
          // instead of "suspend", for child action of the "suspend"
          // parent action.
          const action1 = (action === 'gracefulSuspend' ? 'suspend' : action);
          for (let i = 0; i < filteredData.length; i++) {
            const actionsMap = getDataActionsMap(filteredData[i]);
            if (Object.keys(actionsMap).length > 0) {
              options.push(actionsMap[action]);
              urls.push({path: actionsMap[action].value.resourceData, url: `${actionsMap[action].value.resourceData}?action=${action1}`});
            }
          }
        }
        return {options: options, urls: urls};
    }

    /**
     *
     *@returns {[any]}
     *@private
     */
    function getAllActions() {
      function traverseActions(actions, filteredActions) {
        for (let i = 0; i < actions.length; i++) {
          if (CoreUtils.isNotUndefinedNorNull(actions[i].actions)) {
            for (let j = 0; j < actions[i].actions.length; j++) {
              filteredActions.push(actions[i].actions[j]);
            }
            traverseActions(actions[i].actions, filteredActions);
          }
        }
        return filteredActions;
      }

      return traverseActions([...this.pdjData.actions], []);
    }

    /**
     *@param {string} state
     *@returns {[any]}
     *@private
     *@example
     * const state = "RUNNING";
     * const filteredActions = getSupportedActionsByState(state);
     */
    function getSupportedActionsByState(state) {
      function traverseActions(actions, filteredActions) {
        for (let i = 0; i < actions.length; i++) {
          if (CoreUtils.isNotUndefinedNorNull(actions[i].actions)) {
            traverseActions(actions[i].actions, filteredActions);
          }
          if (CoreUtils.isNotUndefinedNorNull(actions[i].usedIf) && actions[i].usedIf.property === 'State' && actions[i].usedIf.values.includes(state.value)) {
            filteredActions.push(actions[i]);
          }
        }
        return filteredActions;
      }

      return traverseActions([...this.pdjData.actions], []);
    }

    function getButtonIconFile(actionName) {
      let iconFile = 'no-toolbar-icon_24x24';
      if (typeof SUPPORTED_ACTIONS[actionName] !== 'undefined') {
        iconFile = SUPPORTED_ACTIONS[actionName].iconFile;
      }
      return iconFile;
    }

    function createButton(action) {
      const button = {html: document.createElement('oj-button')};
      button['id'] = (CoreUtils.isUndefinedOrNull(action.actions) ? action.label : `${action.name}MenuLauncher`);
      button['name'] = action.name;
      button['disabled'] = false;
      button['asynchronous'] = true;
      button.html.setAttribute('id', (CoreUtils.isUndefinedOrNull(action.actions) ? button.name : button.id));
      button.html.setAttribute('data-action', button.name);
      button.html.setAttribute('on-oj-action', (CoreUtils.isUndefinedOrNull(action.actions) ? '[[actionButtonClicked]]' : '[[launchActionMenu]]'));
      button.html.setAttribute('chroming', 'borderless');
      button.html.setAttribute('disabled', '[[actionButtons.buttons.' + button.name + '.disabled]]');
      const img = document.createElement('img');
      img.className = 'button-icon';
      img.setAttribute('slot', 'startIcon');
      img.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + getButtonIconFile(action.name) + '.png');
      img.setAttribute('alt', action.label);
      button.html.append(img);
      const span = document.createElement('span');
      span.className = 'button-label';
      span.innerText = action.label;
      button.html.append(span);
      return button;
    }

    function createMenu(action) {
      let option;
      const menu = document.createElement('oj-menu');
      menu.setAttribute('id', action.name + 'Menu');
      menu.setAttribute('aria-labelledby', action.name + 'MenuLauncher');
      menu.setAttribute('on-oj-action', '[[actionMenuClickListener]]');
      menu.setAttribute('open-options.launcher', action.name + 'MenuLauncher');
      action.actions.forEach((variant) => {
        option = document.createElement('oj-option');
        option.setAttribute('id', variant.name);
        option.setAttribute('value', variant.name);
        option.setAttribute('data-action', action.name);
        const span = document.createElement('span');
        span.innerText = variant.label;
        option.append(span);
        menu.append(option);
      });
      return menu;
    }

    //public:
    PageDefinitionActions.prototype = {
      hasActions: function () {
        return (CoreUtils.isNotUndefinedNorNull(this.pdjData) && CoreUtils.isNotUndefinedNorNull(this.pdjData.actions));
      },

      hasChosenAction: function (action) {
        let actions = [];
        if (this.hasActions()) {
          const filteredData = getDataByAction.call(this, action);
          for (let i = 0; i < filteredData.length; i++) {
            actions.push(filteredData[i].identity);
          }
        }
        return (actions.length > 0);
      },

      createActionsButtons: function () {
        const actionButtons = {html: document.createElement('p'), buttons: []};
        if (this.hasActions()) {
          actionButtons.html = document.createElement('div');
          for (let i = 0; i < this.pdjData.actions.length; i++) {
            const button = createButton(this.pdjData.actions[i]);
            actionButtons.html.append(button.html);
            actionButtons.buttons[button.name] = {
              id: button.id,
              disabled: ko.observable(button.disabled),
              asynchronous: button.asynchronous
            };
            if (CoreUtils.isNotUndefinedNorNull(this.pdjData.actions[i].actions)) {
              const menu = createMenu(this.pdjData.actions[i]);
              actionButtons.html.append(menu);
            }
          }
        }
        return actionButtons;
      },

      createActionsDialog: function (id) {
        const formLayout = document.createElement('oj-form-layout');
        formLayout.setAttribute('label-edge', 'start');
        let results = {
          domElementId: getTargetMBean.call(this),
          formLayout: formLayout,
          availableItems: [],
          urls: []
        };
        if (this.hasActions()) {
          let dataValues = {};
          const dialogData = getActionsDialogData.call(this, id);
          dataValues[results.domElementId] = {options: dialogData.options};

          const multiSelect = PageDefinitionFields.createMultiSelect(dataValues, results.domElementId);
          const field = multiSelect.field;
          field.setAttribute('available-items', '[[availableItems]]');
          field.setAttribute('chosen-items', '[[chosenItems]]');

          formLayout.append(field);

          results.formLayout = formLayout;
          results.field = field;
          results.availableItems = multiSelect.availableItems;
          results.urls = dialogData.urls;
        }

        return results;
      },

      /**
       * Returns the state (i.e. enabled, disabled) of the specified ``buttons``
       * @param {object} buttons - The buttons to get the state for.
       * @returns {object} - The state (i.e. enabled, disabled) of the specified ``buttons``.
       */
      populateActionsButtonsStates: function (buttons) {
        if (this.hasActions()) {
          for (const key of Object.keys(buttons)) {
            const count = getDataActionsCount.call(this, key);
            buttons[key].disabled(count === 0);
          }
        }
        return buttons;
      },

      /**
       * Disables the specified action ``buttons``
       * @param {object} buttons - The buttons to disable
       * @returns {object} - The buttons that were disabled
       */
      disableAllActionsButtons: function (buttons) {
        if (this.hasActions()) {
          for (const key of Object.keys(buttons)) {
            buttons[key].disabled(true);
          }
        }
        return buttons;
      },

      /**
       * Returns a Promise containing an array of results. Each array item is a result object that is associated with performing the action on each ``chosenItems``.
       * @param {any[]} chosenItems
       * @param {{path: string, url: string}[]} actionUrls
       * @returns {Promise<{succeeded: boolean, messages: any[]|data: any|{severity: string, summary: string, detail: string}}[]>}
       */
      performActionOnChosenItems: function (chosenItems, actionUrls) {
        function performAction(chosenItem, actionUrls) {
          const path = chosenItem.value.resourceData;
          const uri = actionUrls.find(url => url.path === path);
          if (CoreUtils.isUndefinedOrNull(uri.url)) {
            Logger.error(`Unable to perform action because url for '${PageDefinitionUtils.displayNameFromIdentity(chosenItem)}' was undefined! path=${path}`);
            return {
              succeeded: false,
              data: {
                severity: 'error',
                summary: i18n.messages.action.unableToPerform.summary,
                detail: i18n.labels.cannotDetermineExactCause.value
              }
            };
          }
          return CbeDataManager.postActionData(uri.url)
            .then(reply => {
              return {
                succeeded: true,
                data: reply.body.data
              };
            })
            .catch(response => {
              if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                const reply = {
                  succeeded: false
                };
                if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
                  const message = response.body.messages[0].message;
                  if (message.indexOf('Read timed out') !== -1) {
                    reply['succeeded'] = true;
                    reply['data'] = {actionUrl: null};
                  }
                  else {
                    reply['messages'] = response.body.messages;
                  }
                }
                else {
                  reply['data'] = {
                    severity: 'error',
                    summary: i18n.messages.action.unableToPerform.summary,
                    detail: i18n.messages.action.unableToPerform.detail.replace('{1}', PageDefinitionUtils.displayNameFromIdentity(chosenItem)).replace('{0}', response.transport.statusText) + ' ' + oj.Translations.getTranslatedString('wrc-message-displaying.messages.seeJavascriptConsole.detail')
                  };
                }
                return reply;
              }
              else {
                let reasonText = i18n.labels.cannotDetermineExactCause.value;
                if (CoreUtils.isError(response.reason)) {
                  reasonText = response.name;
                } else if (CoreUtils.isError(response.failureReason)) {
                  reasonText = response.failureReason.name;
                }
                return {
                  succeeded: false,
                  data: {
                    severity: 'error',
                    summary: i18n.messages.action.unableToPerform.summary,
                    detail: i18n.messages.action.unableToPerform.detail.replace('{1}', PageDefinitionUtils.displayNameFromIdentity(chosenItem)).replace('{0}', reasonText) + ' ' + oj.Translations.getTranslatedString('wrc-message-displaying.messages.seeJavascriptConsole.detail')
                  }
                };
              }

            });
        }

        // Initialize index and array used as
        // the return value.
        let i = 0, results = [];

        let nextPromise = () => {
          if (i >= chosenItems.length) {
            // We're done, so return the results
            // array in a Promise.resolve()
            return Promise.resolve(results);
          }

          // Call function that operates on each item
          // in chosenItems, passing in chosenItems[i]
          // and actionUrls. That will either return
          // a fulfilled or rejected Promise, but we
          // always turn it into a fulfilled one. This
          // is okay, because there is a succeeded
          // property in the object passed as the
          // Promise value, which can be used to tell
          // if the action was successfully performed
          // or not.
          let newPromise = Promise.resolve(performAction(chosenItems[i], actionUrls))
            .then(result => {
              // Add the result to the results array
              // that gets returned when all the
              // chosenItems have been processed.
              results.push(result);
            });
          // Increment index and recurse the nextPromise
          // function. We'll get out of the loop, when
          // i >= chosenItems.length.
          i++;
          return newPromise.then(nextPromise);
        };

        // Kick off the chain by calling the
        // nextPromise function.
        return Promise.resolve().then(nextPromise);
      }

    };

    // Return PageDefinitionActions constructor function.
    return PageDefinitionActions;
  }
);
