/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/apis/data-operations', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, ko, DataOperations, PageDefinitionUtils, Runtime, CoreTypes, CoreUtils, Logger) {

    const i18n = {
      messages: {
        'action': {
          'unableToPerform': {
            summary: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.unableToPerform.summary'),
            detail: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.unableToPerform.detail', '{0}', '{1}')
          },
          'actionNotPerformed': {
            detail: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.actionNotPerformed.detail', '{0}')
          }
        }
      },
      labels: {
        'cannotDetermineExactCause': {value: oj.Translations.getTranslatedString('wrc-pdj-actions.labels.cannotDetermineExactCause.value')}
      }
    };
    
    function getActionEndpoint(rdjActions, action = '') {
      let endpoint;
      if (CoreUtils.isNotUndefinedNorNull(rdjActions)) {
        const rdjAction = rdjActions[action];
        if (CoreUtils.isNotUndefinedNorNull(rdjAction)) {
          const type = Object.keys(rdjAction)[0];
          endpoint = rdjAction[type];
        }
      }
      return endpoint;
    }

    function getActionInputFormRequest(rdjData, checkedRows, action, rowKeyName) {
      const result = {
        endpoint: getActionEndpoint(rdjData.actions, action)
      };

      let dataPayload = {}

      if (checkedRows.size > 0) {
        dataPayload['rows'] = getActionDataPayloadRows(rdjData, checkedRows, rowKeyName);
      }

      result['dataPayload'] = dataPayload;

      return result;
    }

    function getActionDataPayload(rdjData, options, checkedRows) {
      const actionDataPayload = {rows: {value: []}};
      if (checkedRows.size > 0) {
        for (const rowKeyValue of Array.from(checkedRows)) {
          const index = rdjData.data.map(row => row.identity.value.resourceData).indexOf(rowKeyValue);
          if (index !== -1 && CoreUtils.isNotUndefinedNorNull(rdjData.data[index].identifier)) {
            const row = {value: rdjData.data[index].identifier.value};
            actionDataPayload.rows.value.push(row);
          }
          else {
            const row = {value: {resourceData: rowKeyValue}};
            actionDataPayload.rows.value.push(row);
          }
        }
      }

      return actionDataPayload;
    }

    function getActionDataPayloadRows(rdjData, checkedRows, rowKeyName) {
      let rows = {value: []};
      for (const rowKeyValue of Array.from(checkedRows)) {
        if (rowKeyName === '_identity') {
          const row = rdjData.data.find(row => CoreUtils.isNotUndefinedNorNull(row.identity) && row.identity.value.resourceData === rowKeyValue);
          if (CoreUtils.isNotUndefinedNorNull(row)) {
            rows.value.push(row.identity);
          }
        }
        else if (rowKeyName === '_identifier') {
          rows.value.push({value: rowKeyValue});
        }
      }
      return rows;
    }

    function getActionInputDataPayload(submitResults, checkedRows) {
      let actionInputDataPayload = {};
      if (checkedRows.size > 0) {
        if (CoreUtils.isUndefinedOrNull(submitResults.rows)) {
          actionInputDataPayload['rows'] = {value: []};
          for (const identifier of Array.from(checkedRows)) {
            actionInputDataPayload.rows.value.push({value: identifier});
          }
        }
        else {
          actionInputDataPayload['rows'] = submitResults.rows;
        }
        actionInputDataPayload['data'] = submitResults.data;
      }
      else {
        actionInputDataPayload = submitResults;
      }
      return actionInputDataPayload;
    }

    function createButton(action) {
      const button = {html: document.createElement('oj-button')};
      button['id'] = (CoreUtils.isUndefinedOrNull(action.menus) ? action.label : `${action.name}MenuLauncher`);
      button['name'] = action.name;
      button.html.setAttribute('id', (CoreUtils.isUndefinedOrNull(action.menus) ? button.name : button.id));
      button.html.setAttribute('data-action', button.name);
      button.html.setAttribute('on-oj-action', (CoreUtils.isUndefinedOrNull(action.menus) ? '[[actionButtonClicked]]' : '[[launchActionMenu]]'));
      button.html.setAttribute('chroming', 'borderless');
      button.html.setAttribute('disabled', `[[actionButtons.buttons.${button.name}.disabled]]`);
      const img = document.createElement('img');
      img.className = 'button-icon';
      img.setAttribute('slot', 'startIcon');
      img.setAttribute('src', `js/jet-composites/wrc-frontend/1.0.0/images/${action.iconFile}.png`);
      img.setAttribute('alt', action.label);
      button.html.append(img);
      const span = document.createElement('span');
      span.className = 'button-label';
      span.innerText = action.label;
      button.html.append(span);
      return button;
    }

    function createMenu(action, actionButtons) {
      let option;
      const menu = document.createElement('oj-menu');
      menu.setAttribute('id', `${action.name}Menu`);
      menu.setAttribute('aria-labelledby', `${action.name}MenuLauncher`);
      menu.setAttribute('on-oj-action', '[[actionMenuClickListener]]');
      menu.setAttribute('open-options.launcher', `${action.name}MenuLauncher`);
      menu.setAttribute('slot', 'menu');
      action.menus.forEach((menuItem) => {
        actionButtons.buttons[menuItem.name] = {
          disabled: ko.observable(menuItem.disabled)
        };
        option = document.createElement('oj-option');
        option.setAttribute('id', menuItem.name);
        option.setAttribute('value', menuItem.name);
        option.setAttribute('data-action', action.name);
        option.setAttribute('disabled', `[[actionButtons.buttons.${menuItem.name}.disabled]]`);
        const span = document.createElement('span');
        span.innerText = menuItem.label;
        option.append(span);
        menu.append(option);
      });
      return menu;
    }

    function isAggregatedRuntimeMBean(rdjData) {
      let rtnval = false;
      if (CoreUtils.isNotUndefinedNorNull(rdjData) &&
        CoreUtils.isNotUndefinedNorNull(rdjData.data) &&
        rdjData.data.length > 0
      ) {
        rtnval = CoreUtils.isNotUndefinedNorNull(rdjData.data[0].identifier) && CoreUtils.isNotUndefinedNorNull(rdjData.data[0].identity);
      }
      return rtnval;
    }

    function hasActions(pdjData) {
      let rtnval = false;
      if (CoreUtils.isNotUndefinedNorNull(pdjData)) {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
          rtnval = CoreUtils.isNotUndefinedNorNull(pdjData.table.actions);
        }
        else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
          rtnval = CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.actions);
        }
        else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
          rtnval = CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.actions);
        }
      }
      return rtnval;
    }

    function hasActionInputForm(rdjActions, action) {
      let rtnval = false;
      if (CoreUtils.isNotUndefinedNorNull(rdjActions)) {
        const rdjAction = rdjActions[action];
        rtnval = (
          CoreUtils.isNotUndefinedNorNull(rdjAction) &&
          CoreUtils.isNotUndefinedNorNull(rdjAction.inputForm)
        );
      }
      return rtnval;
    }

    function hasSliceFormActionInput(pdjData) {
      let rtnval = false;
      if (CoreUtils.isNotUndefinedNorNull(pdjData)) {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
          rtnval = CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.actions);
        }
      }
      return rtnval;
    }

    function getActionInputFormStyle(pdjData) {
      let actionInputFormStyle;
      if (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.actionInputForm) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.actionInputForm.properties)
      ) {
        if (pdjData.actionInputForm.properties.length > 0) {
          actionInputFormStyle = 'ACTION_POPUP';
        }
        else {
          actionInputFormStyle = 'CONFIRM_DIALOG';
        }
      }
      return actionInputFormStyle;
    }

    function getActionInputFormLabels(pdjActions, action) {
      const actionInputFormLabels = {};
      for (let i = 0; i < pdjActions.length; i++) {
        if (pdjActions[i].name === action) {
          actionInputFormLabels['label'] = pdjActions[i].label;
          actionInputFormLabels['title'] = pdjActions[i].helpLabel;
          break;
        }
        else if (CoreUtils.isNotUndefinedNorNull(pdjActions[i].actions)) {
          const index = pdjActions[i].actions.map(item => item.name).indexOf(action);
          if (index !== -1) {
            actionInputFormLabels['label'] = pdjActions[i].label;
            actionInputFormLabels['title'] = pdjActions[i].actions[index].helpLabel;
            break;
          }
        }
      }
      return actionInputFormLabels;
    }

    function rowSelectionRequired(pdjData) {
      let rtnval = false;
      if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
        rtnval = pdjData.table.requiresRowSelection;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
        rtnval = pdjData.sliceTable.requiresRowSelection;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
        rtnval = pdjData.sliceForm.requiresRowSelection;
      }
      return rtnval;
    }

    function getRowSelectionProperty(pdjData) {
      let rtnval = 'none';
      if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
        rtnval = pdjData.table.rowSelectionProperty;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
        rtnval = pdjData.sliceTable.rowSelectionProperty;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
        rtnval = pdjData.sliceForm.rowSelectionProperty;
      }
      return rtnval;
    }

    function getNavigationProperty(pdjData) {
      let rtnval = 'none';
      if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
        rtnval = pdjData.table.navigationProperty;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
        rtnval = pdjData.sliceTable.navigationProperty;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
        rtnval = pdjData.sliceForm.navigationProperty;
      }
      return rtnval;
    }

    function getPDJActions(pdjData) {
      let pdjActions;
      if (CoreUtils.isNotUndefinedNorNull(pdjData.table) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.table.actions)
      ) {
        pdjActions = pdjData.table.actions;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.actions)
      ) {
        pdjActions = pdjData.sliceTable.actions;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.actions)
      ) {
        pdjActions = pdjData.sliceForm.actions;
      }
      return pdjActions;
    }

    function getPDJInputFormInstructions(pdjData) {
      return pdjData?.introductionHTML;
    }

    function getParentActionsDisabledState(button) {
      let disabledState = button.disabled;
      const filtered = button.menus.filter(item => item.disabled);
      if (filtered.length === button.menus.length) {
        disabledState = true;
      }
      return disabledState;
    }

    function setActionsDisabledState(declarativeActions, buttons) {
      function computeDisabledState(action, checkedRowsCount, rowSelectionRequired, dataRowsCount) {
        let rtnval = false;
        if (rowSelectionRequired) {
          switch (action.rows) {
            case 'one':
              rtnval = (checkedRowsCount !== 1);
              break;
            case 'multiple':
              rtnval = (checkedRowsCount === 0);
              break;
            case 'none':
              rtnval = (checkedRowsCount !== 0);
              break;
            case 'blank':
              rtnval = (dataRowsCount === 0);
              break;
          }
        }
        return rtnval;
      }

      let disabledState;

      for (let i = 0; i < declarativeActions.buttons.length; i++) {
        disabledState = computeDisabledState(
          declarativeActions.buttons[i],
          declarativeActions.checkedRows.size,
          declarativeActions.rowSelectionRequired,
          declarativeActions.dataRowsCount
        );
        declarativeActions.buttons[i].disabled = disabledState;
        const buttonId = declarativeActions.buttons[i].name;
        buttons[buttonId].disabled(disabledState);
        if (CoreUtils.isNotUndefinedNorNull(declarativeActions.buttons[i].menus)) {
          for (let j = 0; j < declarativeActions.buttons[i].menus.length; j++) {
            disabledState = computeDisabledState(
              declarativeActions.buttons[i].menus[j],
              declarativeActions.checkedRows.size,
              declarativeActions.rowSelectionRequired,
              declarativeActions.dataRowsCount
            );
            declarativeActions.buttons[i].menus[j].disabled = disabledState;
            const menuId = declarativeActions.buttons[i].menus[j].name;
            buttons[menuId].disabled(disabledState);
          }
          declarativeActions.buttons[i].disabled = getParentActionsDisabledState(declarativeActions.buttons[i]);
          buttons[buttonId].disabled(declarativeActions.buttons[i].disabled);
        }
      }
    }

    /**
     *
     * @param {string} actionLabel
     * @param {{resourceData: string}} endpoint
     * @param {{rows?: {value: [{value: object|string}]}, data?: object}} dataPayload
     * @param {boolean} [addActionNotPerformedMessage=true]
     * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
     * @private
     */
    function postActionData(actionLabel, endpoint, dataPayload, addActionNotPerformedMessage = true) {
      return DataOperations.actions.postActionData(endpoint.resourceData, dataPayload)
        .then(reply => {
          return {
            succeeded: true,
            messages: reply.body.messages
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
              }
              else {
                if (addActionNotPerformedMessage) {
                  response.body.messages.unshift({
                    severity: 'error',
                    message: i18n.messages.action.actionNotPerformed.detail.replace('{0}', actionLabel)
                  });
                }
                reply['messages'] = response.body.messages;
              }
            }
            else {
              reply['messages'] = [{
                severity: 'error',
                summary: i18n.messages.action.unableToPerform.summary,
                detail: i18n.messages.action.unableToPerform.detail.replace('{1}', actionLabel).replace('{0}', response.transport.statusText) + ' ' + oj.Translations.getTranslatedString('wrc-message-displaying.messages.seeJavascriptConsole.detail')
              }];
            }
            return Promise.reject(reply);
          }
          else {
            let reasonText = i18n.labels.cannotDetermineExactCause.value;
            if (CoreUtils.isError(response.reason)) {
              reasonText = response.name;
            } else if (CoreUtils.isError(response.failureReason)) {
              reasonText = response.failureReason.name;
            }
            return Promise.reject({
              succeeded: false,
              messages: [{
                severity: 'error',
                summary: i18n.messages.action.unableToPerform.summary,
                detail: i18n.messages.action.unableToPerform.detail.replace('{1}', actionLabel).replace('{0}', response.transport.statusText) + ' ' + oj.Translations.getTranslatedString('wrc-message-displaying.messages.seeJavascriptConsole.detail')
              }]
            });
          }

        });
    }
    
    async function performDownloadAction(rdjData, declarativeActions, options) {
      function createDownloadActionReply(replies) {
        const reply = {messages: []};
        for (const item of replies) {
          reply.messages = [...reply.messages, ...item.messages];
        }
        reply['succeeded'] = (reply.messages.filter(message => message.severity === 'error').length === 0);
        return reply;
      }

      if (declarativeActions.checkedRows.size > 0) {
        const replies = [];
        const rowKeyName = `_${declarativeActions.rowSelectionProperty}` ;
        const endpoint = getActionEndpoint(rdjData.actions, options.action);
        for (const rowKeyValue of Array.from(declarativeActions.checkedRows)) {
          const actionDataPayload = {rows: {value: []}};
          const row = rdjData.data.find(row => CoreUtils.isNotUndefinedNorNull(row.identity) && row.identity.value.resourceData === rowKeyValue);
          if (rowKeyName === '_identity') {
            actionDataPayload.rows.value.push({value: row.identity.value});
          }
          else if (rowKeyName === '_identifier') {
            actionDataPayload.rows.value.push({value: row.identifier.value});
          }

          try {
            const reply = await postActionData(options.label, endpoint, actionDataPayload);
            replies.push({messages: reply.messages});
          }
          catch (failure) {
            if (CoreUtils.isNotUndefinedNorNull(failure.messages)) {
              replies.push({messages: failure.messages});
            }
            else {
              replies.push({messages: [{
                severity: 'error',
                message: failure
              }]});
            }
          }
        }
        const actionReply = createDownloadActionReply(replies);
        return Promise.resolve(actionReply);
      }
      else {
        return Promise.resolve({succeeded: true, messages: []});
      }
    }

    /**
     *
     * @param {string} pdjAction
     * @returns {{action: string, interval: number, maxPolls: number, endWhenPairs?: [{name: string, value: any}]}}
     */
    function getActionPollingObject(pdjAction) {
      /**
       * Declare return variable and set the default values in it.
       * @type {{action: string, interval: number, maxPolls: number}}
       * @private
       */
      const actionPolling = {
        action: pdjAction.name,
        interval: 0,
        maxPolls: 0
      };

      if (CoreUtils.isNotUndefinedNorNull(pdjAction.polling)) {
        actionPolling.interval = pdjAction.polling.reloadSeconds;
        actionPolling.maxPolls = pdjAction.polling.maxAttempts;
      }

      return actionPolling;
    }

    function getPDJActionPolling(declarativeActions, action) {
      let actionPolling = {
        action: action,
        interval: 0,
        maxPolls: 0
      };
      let wasFound = false;
      for (let i = 0; i < declarativeActions.buttons.length && !wasFound; i++) {
        if (declarativeActions.buttons[i].name === action &&
          CoreUtils.isNotUndefinedNorNull(declarativeActions.buttons[i].polling)
        ) {
          actionPolling = declarativeActions.buttons[i].polling;
          wasFound = true;
        }
        else if (CoreUtils.isNotUndefinedNorNull(declarativeActions.buttons[i].menus)) {
          for (let j = 0; j < declarativeActions.buttons[i].menus.length  && !wasFound; j++) {
            if (declarativeActions.buttons[i].menus[j].name === action &&
              CoreUtils.isNotUndefinedNorNull(declarativeActions.buttons[i].menus[j].polling)
            ) {
              actionPolling = declarativeActions.buttons[i].menus[j].polling;
              wasFound = true;
            }
          }
        }
      }
      return actionPolling;
    }

    function updateSubmittedCheckedRows(declarativeActions, options) {
      switch (options.action) {
        case 'deleteMessages':
        case 'deleteSelectedMessages':
          declarativeActions.checkedRows.clear();
          break;
      }
    }

  //public:
    return {
      RowSelectionType: Object.freeze({
        NONE: {name: 'none'},         // the action applies to the page (e.g. import jms messages from a file)
        ONE: {name: 'one'},           // the user must select exactly one row (e.g. display a jms message's details)
        MULTIPLE: {name: 'multiple'}  // the user must select one or more rows (e.g. start one or more servers)
      }),

      isRowSelectionRequired: (pdjData) => {
        return rowSelectionRequired(pdjData);
      },
      
      ActionInputFormStyle: Object.freeze({
        CONFIRM_DIALOG: {name: 'CONFIRM_DIALOG'},
        ACTION_POPUP: {name: 'ACTION_POPUP'}
      }),
      
      hasActions: (pdjData) => {
        return hasActions(pdjData);
      },

      hasActionInputForm: (rdjActions, action) => {
        return hasActionInputForm(rdjActions, action);
      },

      hasSliceFormActionInput: (pdjData) => {
        return hasSliceFormActionInput(pdjData);
      },

      getRowSelectionProperty: (pdjData) => {
        return getRowSelectionProperty(pdjData);
      },

      getNavigationProperty: (pdjData) => {
        return getNavigationProperty(pdjData);
      },

      getActionInputFormStyle: (pdjData) => {
        return getActionInputFormStyle(pdjData);
      },

      getActionInputFormLabels: (pdjData, action) => {
        const pdjActions = getPDJActions(pdjData);
        return getActionInputFormLabels(pdjActions, action);
      },

      onCheckedRowsChanged: (declarativeActions, buttons) => {
        setActionsDisabledState(declarativeActions, buttons);
      },

      onCheckedRowsSubmitted: (declarativeActions, options) => {
        return updateSubmittedCheckedRows(declarativeActions, options);
      },

      populateDeclarativeActions: (rdjData, pdjData, declarativeActions) => {
        declarativeActions.dataRowsCount = 0;
        const settingsActions = Runtime.getSettingsActions();
        if (CoreUtils.isNotUndefinedNorNull(settingsActions)) {
          const pdjActions = getPDJActions(pdjData);
          if (CoreUtils.isNotUndefinedNorNull(pdjActions)) {
            declarativeActions.rowSelectionRequired = rowSelectionRequired(pdjData);
            declarativeActions['rowSelectionProperty'] = getRowSelectionProperty(pdjData);
            declarativeActions['navigationProperty'] = getNavigationProperty(pdjData);
            declarativeActions.dataRowsCount = rdjData.data.length;
            declarativeActions.buttons = [];
            for (const pdjAction of pdjActions) {
              const index = settingsActions.map(item => item.id).indexOf(pdjAction.name);
              if (index !== -1) {
                const button = {};
                button['name'] = pdjAction.name;
                button['label'] = pdjAction.label;
                button['iconFile'] = settingsActions[index].iconFile;
                button['disabled'] = true;
                if (CoreUtils.isNotUndefinedNorNull(pdjAction.rows)) {
                  button['disabled'] = (pdjAction.rows !== 'none');
                  button['rows'] = pdjAction.rows;
                }
                else {
                  button['disabled'] = (declarativeActions.dataRowsCount === 0);
                  button['rows'] = 'blank';
                }
                if (CoreUtils.isNotUndefinedNorNull(pdjAction.polling)) {
                  button['polling'] = getActionPollingObject(pdjAction);
                }
                if (pdjAction.actions) {
                  button['menus'] = [];
                  for (const menu of pdjAction.actions) {
                    const menuItem = {
                      name: menu.name,
                      label: menu.label,
                      disabled: (declarativeActions.rowSelectionRequired && menu.rows === 'multiple'),
                      rows: menu.rows
                    };
                    if (CoreUtils.isNotUndefinedNorNull(menu.polling)) {
                      menuItem['polling'] = getActionPollingObject(menu);
                    }
                    button.menus.push(menuItem);
                  }
                  button.disabled = getParentActionsDisabledState(button);
                }
                declarativeActions.buttons.push(button);
              }
            }
          }
        }
      },

      createActionsButtons: (declarativeActions) => {
        const actionButtons = {html: document.createElement('p'), buttons: []};
        if (declarativeActions.buttons.length > 0) {
          actionButtons.html = document.createElement('div');
          for (let i = 0; i < declarativeActions.buttons.length; i++) {
            const button = createButton(declarativeActions.buttons[i]);
            actionButtons.html.append(button.html);
            actionButtons.buttons[button.name] = {
              id: button.id,
              disabled: ko.observable(declarativeActions.buttons[i].disabled)
            };
            if (CoreUtils.isNotUndefinedNorNull(declarativeActions.buttons[i].menus)) {
              const menu = createMenu(declarativeActions.buttons[i], actionButtons);
              actionButtons.html.append(menu);
            }
          }
        }
        return actionButtons;
      },

      getPDJTypesHelpColumns: (pdjData) => {
        let pdjTypesHelpColumns = [];
        const pdjActions = getPDJActions(pdjData);
        if (CoreUtils.isNotUndefinedNorNull(pdjActions)) {
          for (const pdjAction of pdjActions) {
            if (CoreUtils.isUndefinedOrNull(pdjAction.actions)) {
              pdjTypesHelpColumns.push(pdjAction);
            }
            else if (CoreUtils.isNotUndefinedNorNull(pdjAction.actions)) {
              for (const menu of pdjAction.actions) {
                pdjTypesHelpColumns.push(menu);
              }
            }
          }
        }
        return pdjTypesHelpColumns;
      },
      
      updatePDJTypesActionInputProperties: (pdjData) => {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.actionInputForm) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.actionInputForm.properties)
        ) {
          let index = pdjData.actionInputForm.properties.map(property => property.name).indexOf('selector');
          if (index !== -1) {
            pdjData.actionInputForm.properties[index]['presentation'] = {width: 'lg'};
          }
        }
      },

      getPDJActionPollingObject: (declarativeActions, action) => {
        return getPDJActionPolling(declarativeActions, action);
      },

      getActionEndpoint: (rdjActions, action) => {
        return getActionEndpoint(rdjActions, action);
      },

      getActionInputFormRequest:(rdjData, declarativeActions, action, rowKeyName) => {
        delete declarativeActions.inputForm;
        const result = getActionInputFormRequest(rdjData, declarativeActions.checkedRows, action, rowKeyName);
        if (CoreUtils.isNotUndefinedNorNull(result.dataPayload.rows)) {
          declarativeActions['inputForm'] = {rows: result.dataPayload.rows};
        }
        return result;
      },

      getActionIconFile: (action) => {
        let iconFile = 'action-empty-icon-blk_24x24';
        const settingsActions = Runtime.getSettingsActions();
        if (CoreUtils.isNotUndefinedNorNull(settingsActions)) {
          const index = settingsActions.map(item => item.id).indexOf(action);
          if (index !== -1) {
            iconFile = settingsActions[index].iconFile;
          }
        }
        return iconFile;
      },

      performActionOnCheckedRows: (rdjData, declarativeActions, options) => {
        if (options.isDownloadAction) {
          return performDownloadAction(rdjData, declarativeActions, options);
        }
        else {
          const dataPayload = getActionDataPayload(rdjData, options, declarativeActions.checkedRows);
          const endpoint = getActionEndpoint(rdjData.actions, options.action);
          return postActionData(options.label, endpoint, dataPayload);
        }
      },

      submitActionInputForm: (submitResults, checkedRows, endpoint, options) => {
        const dataPayload = getActionInputDataPayload(submitResults, checkedRows);
        return postActionData(options.label, endpoint, dataPayload);
      }

    };

  }
);