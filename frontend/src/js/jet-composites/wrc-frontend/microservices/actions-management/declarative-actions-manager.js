/**
 * @license
 * Copyright (c) 2023, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'wrc-frontend/core/parsers/yaml',
    'text!wrc-frontend/config/wrc-actions.yaml',
    'ojs/ojcore',
    'knockout',
    'wrc-frontend/apis/data-operations',
    'wrc-frontend/microservices/page-definition/utils',
    'wrc-frontend/common/page-definition-helper',
    'wrc-frontend/common/confirmations-dialog',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/types',
    'wrc-frontend/core/utils',
    'ojs/ojlogger'
  ],
  function (
    YamlParser,
    WrcActionsFileContents,
    oj,
    ko,
    DataOperations,
    PageDefinitionUtils,
    PageDefinitionHelper,
    ConfirmationsDialog,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils,
    Logger
  ) {
    let backendActions = [], frontendActions;

    YamlParser.parse(WrcActionsFileContents)
      .then(config => {
        if (config && config.actions && config.actions.backend) {
          backendActions = config.actions.backend;
        }
        if (config && config.actions && config.actions.frontend) {
          frontendActions = config.actions.frontend;
        }
      })
      .catch((err) => {
        Logger.error(err);
      });

    const i18n = {
      messages: {
        'action': {
          'unableToPerform': {
            summary: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.unableToPerform.summary'),
            detail: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.unableToPerform.detail', '{0}', '{1}')
          },
          'actionNotPerformed': {
            detail: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.actionNotPerformed.detail', '{0}')
          },
          'actionNotPerformedNoRow': {
            detail: oj.Translations.getTranslatedString('wrc-pdj-actions.messages.action.actionNotPerformedNoRow.detail', '{0}')
          }
        }
      },
      labels: {
        'cannotDetermineExactCause': {value: oj.Translations.getTranslatedString('wrc-pdj-actions.labels.cannotDetermineExactCause.value')}
      },
      buttons: {
        yes: {
          disabled: false,
          label: oj.Translations.getTranslatedString('wrc-common.buttons.yes.label')
        },
        no: {
          disabled: false,
          label: oj.Translations.getTranslatedString('wrc-common.buttons.no.label')
        },
        ok: {
          disabled: false,
          label: oj.Translations.getTranslatedString('wrc-common.buttons.ok.label')
        },
        cancel: {
          disabled: false,
          visible: ko.observable(false),
          label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
        }
      },
      dialog: {
        title: ko.observable(''),
        instructions: ko.observable(''),
        prompt: ko.observable('')
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

    function getActionDataPayload(rdjData, options,  declarativeActions) {
      const actionDataPayload = {rows: {value: []}};
      if ( declarativeActions.checkedRows.size > 0) {
        for (const rowKeyValue of Array.from( declarativeActions.checkedRows)) {
          let row;
          const index = rdjData.data.findIndex(row => row?.identity && row.identity.value.resourceData === rowKeyValue);

          if (index !== -1) {
            if (CoreUtils.isNotUndefinedNorNull(rdjData.data[index].identifier)) {
              row = {value: rdjData.data[index].identifier.value};
              actionDataPayload.rows.value.push(row);
            }
            else {
              row = { value: { resourceData: rowKeyValue } };
              actionDataPayload.rows.value.push(row);
            }
          }
          else {
            // the checked row might refer to rdjData.data[x].identifier.value such as invoking an aggregate action on a sliceTable..
            // if that is the case pass the entire identifier to the backend
            const identifierIndex = rdjData.data.findIndex(row => row.identifier?.value === rowKeyValue);

            if (identifierIndex !== -1) {
              row = rdjData.data[identifierIndex].identifier;
            }
            else {
              // assume that the rowKeyValue is a path to a resource 
              row = { value: { resourceData: rowKeyValue } };
            }
            actionDataPayload.rows.value.push(row);
          }
        }
      }

      return actionDataPayload;
    }

    function getActionDataPayloadRows(rdjData, checkedRows, rowKeyName) {
      let rows = {value: []};
      for (const rowKeyValue of Array.from(checkedRows)) {
        const row = rdjData.data.find(row => CoreUtils.isNotUndefinedNorNull(row.identity) && row.identity.value.resourceData === rowKeyValue);
        if (rowKeyName === '_identity') {
          if (CoreUtils.isNotUndefinedNorNull(row)) {
            rows.value.push(row.identity);
          }
        }
        else if (rowKeyName === '_identifier') {
          if (CoreUtils.isNotUndefinedNorNull(row)) {
            rows.value.push(row.identifier);
          } else {
            rows.value.push({value: rowKeyValue});
          }
        }
      }
      return rows;
    }

    function getActionInputMultipartFormDataPayload(multipartForm, submitResults, checkedRows) {
      let multipartFormDataPayload = {};
      if (checkedRows.size > 0) {
        const actionInputDataPayload = {rows: {value: []}};
        for (const identity of Array.from(checkedRows)) {
          actionInputDataPayload.rows.value.push({value: {resourceData: identity}});
        }
        const requestBody = {
          data: {},
          rows: actionInputDataPayload.rows
        };
        multipartFormDataPayload = multipartForm.createMultipartFormData(
          requestBody,
          submitResults,
          false
        );
      }

      // If all went well inside the createMultipartFormData()
      // call, then the form data for the multipart-form will
      // be assigned to multipartFormDataPayload.formData. Otherwise,
      // multipartFormDataPayload will be an empty JS object.
      return multipartFormDataPayload.formData;
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
        if (CoreUtils.isNotUndefinedNorNull(menuItem.menus)) {

          let option = document.createElement('oj-option');
          option.setAttribute('id', menuItem.name);
          option.setAttribute('value', menuItem.name);
          option.setAttribute('data-action', action.name);
          option.setAttribute('disabled', false);
          const span1 = document.createElement('span');
          span1.innerText = menuItem.label;
          option.append(span1);
          const subMenu = createSubMenu(menuItem, actionButtons, action.name);
          option.append(subMenu);
          menu.append(option);
          //actionButtons.html.append(subMenu);
        }
        else {
          option = document.createElement('oj-option');
          option.setAttribute('id', menuItem.name);
          option.setAttribute('value', menuItem.name);
          option.setAttribute('data-action', action.name);
          option.setAttribute('disabled', `[[actionButtons.buttons.${menuItem.name}.disabled]]`);
          const span = document.createElement('span');
          span.innerText = menuItem.label;
          option.append(span);
          menu.append(option);
          const AM = menu.innerHTML;
        }
      });
      return menu;
    }

    function createSubMenu(menu, actionButtons, actionName) {
      let option;
      const subMenu = document.createElement('oj-menu');
      subMenu.setAttribute('id', `${menu.name}Menu`);
      menu.menus.forEach((menuItem) => {
        actionButtons.buttons[menuItem.name] = {
          disabled: ko.observable(menuItem.disabled)
        };
        option = document.createElement('oj-option');
        option.setAttribute('id', menuItem.name);
        option.setAttribute('value', menuItem.name);
        option.setAttribute('data-action', actionName);
        //option.setAttribute('disabled', `[[actionButtons.buttons.${menuItem.name}.disabled]]`);
        option.setAttribute('disabled', false);
        const span = document.createElement('span');
        span.innerText = menuItem.label;
        option.append(span);
        subMenu.append(option);
        const AO = option.innerHTML;
        const AS = subMenu.innerHTML;
        const ATemp = false;
      });
      const SIn = subMenu.innerHTML;
      return subMenu;
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
          let subAction = pdjActions[i].actions;
          for (let sub = 0; sub < subAction.length; sub++) {
            if (subAction[sub].name === action) {
              actionInputFormLabels['label'] = subAction[sub].label;
              actionInputFormLabels['title'] = subAction[sub].helpLabel;
              break;
            }
            else if (CoreUtils.isNotUndefinedNorNull(subAction[sub].actions)) {
              const index = subAction[sub].actions.map(item => item.name).indexOf(action);
              if (index !== -1) {
                actionInputFormLabels['label'] = subAction[sub].label;
                actionInputFormLabels['title'] = subAction[sub].actions[index].helpLabel;
                break;
              }
            }
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

    function setActionConstraintDisabledState(tableData, declarativeActions, buttons, action) {
      function matchedRowIndexConstraintValue(constraint, tableData, rowIndex) {
        let rtnval = false;
        switch (constraint.value) {
          case 'first':
            rtnval = (rowIndex === 0);
            break;
          case 'last':
            rtnval = (rowIndex === tableData.length - 1);
            break;
        }
        return rtnval;
      }

      if (declarativeActions.checkedRows.size !== 1) {
        for (let i = 0; i < declarativeActions.buttons.length; i++) {
          if (declarativeActions.buttons[i].rows !== 'none' && declarativeActions.navigationProperty !== 'none' && declarativeActions.rowSelectionProperty !== 'none' && declarativeActions.rowSelectionRequired !== false) {
            declarativeActions.buttons[i].disabled = true;
            buttons[declarativeActions.buttons[i].name].disabled(true);
          }
        }
      }
      else if (declarativeActions.checkedRows.size === 1) {
        const values = Array.from(declarativeActions.checkedRows);
        if (values && values.length > 0) {
          const resourceData = values[0];
          const identityRows = tableData.filter(row => CoreUtils.isNotUndefinedNorNull(row.identity));
          if (identityRows.length > 0) {
            const rowIndex = tableData.map(row => row.identity.value.resourceData).indexOf(resourceData);
            if (rowIndex !== -1) {
              let actions;
              if (CoreUtils.isNotUndefinedNorNull(action)) {
                actions = declarativeActions.buttons.filter(action => action.constraint && action.name === action);
              }
              else {
                actions = declarativeActions.buttons.filter(action => CoreUtils.isNotUndefinedNorNull(action.constraint));
              }

              for (const action of actions) {
                // At this point, we already know that action has a
                // constraint property. What we don't know is whether
                // the constraint.type is 'rowIndex', or not.
                if (action.constraint.type === 'rowIndex') {
                  // It is, so we need to disable the action when the
                  // row checked in the table, matches constraint.value.
                  const valueMatched = matchedRowIndexConstraintValue(
                    action.constraint,
                    tableData,
                    rowIndex
                  );
                  // Next, we need to get the index of the UI button
                  // control.
                  const buttonIndex = declarativeActions.buttons.map(button => button.name).indexOf(action.name);
                  if (buttonIndex !== -1) {
                    declarativeActions.buttons[buttonIndex].disabled = valueMatched;
                    // Found it, so use buttonIndex to get the buttonId.
                    const buttonId = declarativeActions.buttons[buttonIndex].name;
                    // Last but not least, use buttonId to update value of disabled
                    // observable.
                    buttons[buttonId].disabled(valueMatched);
                  }
                }
              }
            }
          }
        }
      }
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

      const filtered = declarativeActions.buttons.filter(action => CoreUtils.isUndefinedOrNull(action.constraint));

      for (let i = 0; i < filtered.length; i++) {
        disabledState = computeDisabledState(
          filtered[i],
          declarativeActions.checkedRows.size,
          declarativeActions.rowSelectionRequired,
          declarativeActions.dataRowsCount
        );
        filtered[i].disabled = disabledState;
        const buttonId = filtered[i].name;
        buttons[buttonId].disabled(disabledState);
        if (CoreUtils.isNotUndefinedNorNull(filtered[i].menus)) {
          for (let j = 0; j < filtered[i].menus.length; j++) {
            disabledState = computeDisabledState(
              filtered[i].menus[j],
              declarativeActions.checkedRows.size,
              declarativeActions.rowSelectionRequired,
              declarativeActions.dataRowsCount
            );
            filtered[i].menus[j].disabled = disabledState;
            const menuId = filtered[i].menus[j].name;
            buttons[menuId].disabled(disabledState);
          }
          filtered[i].disabled = getParentActionsDisabledState(filtered[i]);
          buttons[buttonId].disabled(filtered[i].disabled);
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
            succeeded: reply.transport.status === 200,
            messages: reply.body.messages
          };
        })
        .catch(response => {
          if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
            return handlePostActionDataResponse(response, actionLabel, addActionNotPerformedMessage);
          }

        });
    }

    /**
     *
     * @param {string} actionLabel
     * @param {{resourceData: string}} endpoint
     * @param {FormData} formData
     * @param {boolean} [addActionNotPerformedMessage=true]
     * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
     * @private
     */
    function multipartPostActionData(actionLabel, endpoint, formData, addActionNotPerformedMessage = true) {
      const url = `${Runtime.getBackendUrl()}${endpoint.resourceData}`;
      return DataOperations.mbean.upload(url, formData)
        .then(reply => {
          return {
            succeeded: true,
            messages: reply.body.messages
          };
        })
        .catch(response => {
          return handlePostActionDataResponse(response, actionLabel, addActionNotPerformedMessage);
        });
    }

    function handlePostActionDataResponse(response, actionLabel, addActionNotPerformedMessage) {
      if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
        const reply = {
          succeeded: false
        };
        if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
          const message = response.body.messages[0].message;
          if (message.indexOf('Read timed out') !== -1) {
            reply['succeeded'] = true;
          }
          else if (response?.transport?.status === 504) {
            reply['messages'] = response.body.messages;
          }
          else {
            if (addActionNotPerformedMessage) {
              response.body.messages.unshift({
                severity: 'error',
                message: i18n.messages.action.actionNotPerformed.detail.replace('{0}', actionLabel)
              });
            } else {
              response.body.messages.unshift({
                severity: 'error',
                message: i18n.messages.action.actionNotPerformedNoRow.detail.replace('{0}', actionLabel)
              });
            }
            reply['messages'] = response.body.messages;
          }
        }
        else if (response.transport.status === 404 || response.transport.status === 502) {
          reply['transport'] = {status: 502, statusText: 'Bad Gateway'};
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
        }
        else if (CoreUtils.isError(response.failureReason)) {
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

    }

    async function performDeleteAction(rdjData, declarativeActions, options) {
      if (declarativeActions.checkedRows.size > 0) {
        const actionDataPayload = {rows: {value: []}};
        const rowKeyName = declarativeActions.rowSelectionProperty;
        for (const rowKeyValue of Array.from(declarativeActions.checkedRows)) {
          const row = rdjData.data.find(row => CoreUtils.isNotUndefinedNorNull(row.identity) && row.identity.value.resourceData === rowKeyValue);
          if (rowKeyName === 'identity') {
            actionDataPayload.rows.value.push({value: row.identity.value});
          }
          else if (rowKeyName === 'identifier') {
            actionDataPayload.rows.value.push({value: row.identifier.value});
          }
        }

        if (actionDataPayload.rows.value.length > 0 &&
          typeof declarativeActions.deleteActionCallback === 'function'
        ) {
          for (const identity of actionDataPayload.rows.value) {
            declarativeActions.deleteActionCallback(identity.value.resourceData);
          }
        }
      }
      return Promise.resolve({succeeded: true, messages: []});
    }

    async function defaultPerformAction(rdjData, declarativeActions, options) {
      const dataPayload = getActionDataPayload(rdjData, options, declarativeActions);
      const endpoint = getActionEndpoint(rdjData.actions, options.action);
      return postActionData(options.label, endpoint, dataPayload);
    }

    async function performExecutionOrderConstrainedAction(rdjData, declarativeActions, options) {
      const executionOrderConstraint = getExecutionOrderConstraint(rdjData, declarativeActions);
      if (executionOrderConstraint.enabled) {
        if (executionOrderConstraint.requiresConfirm) {
          return showConfirmationDialog(executionOrderConstraint)
            .then(reply => {
              if (reply) {
                options['pollingIntervalOverride'] = -1;
                return defaultPerformAction(rdjData, declarativeActions, options)
                  .then(reply => {
                    delete reply.messages;
                    return Promise.resolve(reply);
                  });
              }
              else {
                return Promise.resolve({succeeded: false});
              }
            })
        }
        else {
          const response = {
            transport: {
              status: 400,
              statusText: 'Bad Request'
            },
            body: {
              messages: [
                {
                  'severity': 'error',
                  'message': oj.Translations.getTranslatedString('wrc-message-line.messages.shutdownSequenceError.details')
                }
              ]
            },
            failureType: CoreTypes.FailureType.CBE_REST_API,
            failureReason: 'Bad Request'
          };
          return handlePostActionDataResponse(response, options.label, true);
        }
      }
      else{
        return defaultPerformAction(rdjData, declarativeActions, options);
      }
    }

    function getExecutionOrderConstraint(rdjData, declarativeActions) {
      const executionOrderConstraint = {enabled: false, requiresConfirm: false};
      if (declarativeActions.checkedRows.size > 0) {
        const rowKeyName = declarativeActions.rowSelectionProperty;
        for (const rowKeyValue of Array.from(declarativeActions.checkedRows)) {
          const row = rdjData.data.find(row => CoreUtils.isNotUndefinedNorNull(row.identity) && row.identity.value.resourceData === rowKeyValue);
          if (CoreUtils.isNotUndefinedNorNull(row) && row.identity.value.label === 'AdminServer') {
            executionOrderConstraint.enabled = true;
            executionOrderConstraint.requiresConfirm = true;
            if (rowKeyName === 'identity') {
              executionOrderConstraint['label'] = row.identity.value.label;
              executionOrderConstraint['resourceData'] = row.identity.value.resourceData;
            }
          }
        }
      }

      return executionOrderConstraint;
    }

    function showConfirmationDialog(executionOrderConstraint) {
      return new Promise(function (resolve) {
        i18n.dialog.title(oj.Translations.getTranslatedString('wrc-confirm-dialogs.adminServerShutdown.title.value'));
        i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-confirm-dialogs.adminServerShutdown.prompt.value', executionOrderConstraint.label));
        i18n.buttons.cancel.visible(false);
        ConfirmationsDialog.showConfirmDialog('ShutdownAdminServer', i18n)
          .then(reply => {
            switch (reply.exitButton) {
              case 'yes':
                resolve(true);
                break;
              case 'no':
                resolve(false);
                break;
              case 'cancel':
                resolve(null);
                break;
            }
          });
      });
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

    function isExecutionOrderConstrainedAction(action) {
      return (['forceShutdown', 'gracefulShutdown'].includes(action));
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
          for (let j = 0; j < declarativeActions.buttons[i].menus.length && !wasFound; j++) {
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

      hasFrontendActions: () => {
        return (frontendActions.length > 0);
      },

      hasActions: (pdjData) => {
        return hasActions(pdjData);
      },

      hasActionInputForm: (rdjActions, action) => {
        return hasActionInputForm(rdjActions, action);
      },

      hasSliceFormActionInput: (pdjData) => {
        return hasSliceFormActionInput(pdjData);
      },

      willAffectChangeManager: (action = '') => {
        let filtered = backendActions.filter(item => item.affectsChangeManager && item.id === action);
        return (filtered.length > 0);
      },

      getDeletable: (rdjData) => {
        return PageDefinitionHelper.isDeletable(rdjData);
      },

      getActionInputFormStyle: (pdjData) => {
        return getActionInputFormStyle(pdjData);
      },

      getActionInputFormLabels: (pdjData, action) => {
        const pdjActions = getPDJActions(pdjData);
        return getActionInputFormLabels(pdjActions, action);
      },

      getActionInputFormLayoutSettings: (pdjActions, action) => {
        const formLayout = {
          options: {
            labelWidthPcnt: '24%',
            maxColumns: '1'
          },
          minWidth: parseInt(ViewModelUtils.getCustomCssProperty('overlayDialog-actionInput-width'), 10)
        };
        if (['updatePlanOnServer', 'uploadAndUpdate',
          'redeploySourceOnServer', 'uploadAndRedeploy'].includes(action)) {
          formLayout.options.labelWidthPcnt = '28%';
          formLayout.minWidth = 850;
        }
        return formLayout;
      },

      onApplyActionConstraints: (tableData, declarativeActions, buttons, action) => {
        setActionConstraintDisabledState(tableData, declarativeActions, buttons, action);
      },

      onCheckedRowsChanged: (declarativeActions, buttons) => {
        setActionsDisabledState(declarativeActions, buttons);
      },

      onCheckedRowsSubmitted: (declarativeActions, options) => {
        return updateSubmittedCheckedRows(declarativeActions, options);
      },

      addDeclarativeAction: (action, rdjData, pdjData, declarativeActions) => {
        function createPDJAction(settingsAction, rdjData, pdjData) {
          declarativeActions['rowSelectionRequired'] = true;
          declarativeActions['rowSelectionProperty'] = 'identity';
          declarativeActions['navigationProperty'] = 'identity';
          declarativeActions['isDeletable'] = PageDefinitionHelper.isDeletable(rdjData);
          declarativeActions.dataRowsCount = rdjData.data.length;
          return {
            name: settingsAction.id,
            label: settingsAction.label,
            rows: settingsAction.rows,
            helpLabel: settingsAction.helpLabel,
            helpSummaryHTML: settingsAction.helpSummaryHTML,
            detailedHelpHTML: settingsAction.detailedHelpHTML
          };
        }

        function addPDJAction(buttons, settingsAction, rdjData, pdjData) {
          const pdjAction = createPDJAction(settingsAction, rdjData, pdjData);
          if (PageDefinitionHelper.hasTable(pdjData)) {
            if (hasActions(pdjData)) {
              const index = pdjData.table.actions.findIndex(item => item.name === settingsAction.id);
              if (index === -1) {
                pdjData.table.actions.unshift(pdjAction);
              }
            }
            else {
              pdjData.table.requiresRowSelection = true;
              pdjData.table.rowSelectionProperty = 'identity';
              pdjData.table['actions'] = [pdjAction];
            }
          }
          else if (PageDefinitionHelper.hasSliceTable(pdjData)) {
            if (hasActions(pdjData)) {
              const index = pdjData.sliceTable.actions.findIndex(item => item.name === settingsAction.id);
              if (index === -1) {
                pdjData.sliceTable.actions.unshift(pdjAction);
              }
            }
            else {
              pdjData.sliceTable.requiresRowSelection = true;
              pdjData.sliceTable.rowSelectionProperty = 'identity';
              pdjData.sliceTable['actions'] = [pdjAction];
            }
          }

          const index = buttons.findIndex(button => button.name === pdjAction.name);

          if (index === -1) {
            const button = {};
            button['name'] = pdjAction.name;
            button['label'] = pdjAction.label;
            button['iconFile'] = settingsAction.iconFile;
            button['disabled'] = true;
            if (CoreUtils.isNotUndefinedNorNull(pdjAction.rows)) {
              button['disabled'] = (pdjAction.rows !== 'none');
              button['rows'] = pdjAction.rows;
            }
            else {
              button['rows'] = 'blank';
            }
            buttons.unshift(button);
          }
        }

        declarativeActions['isDeletable'] = PageDefinitionHelper.isDeletable(rdjData);

        if (CoreUtils.isNotUndefinedNorNull(declarativeActions.isDeletable) && declarativeActions.isDeletable) {
          if (frontendActions.length > 0) {
            const index = frontendActions.findIndex(item => item.id === action);
            if (index !== -1) {
              addPDJAction(declarativeActions.buttons, frontendActions[index], rdjData, pdjData);
            }
          }
        }
      },

      populateDeclarativeActions: (rdjData, pdjData, declarativeActions) => {
        declarativeActions.dataRowsCount = 0;
        if (backendActions.length > 0) {
          const pdjActions = getPDJActions(pdjData);
          if (CoreUtils.isNotUndefinedNorNull(pdjActions)) {
            declarativeActions.rowSelectionRequired = rowSelectionRequired(pdjData);
            declarativeActions['rowSelectionProperty'] = getRowSelectionProperty(pdjData);
            declarativeActions['isDeletable'] = PageDefinitionHelper.isDeletable(rdjData);
            declarativeActions['navigationProperty'] = getNavigationProperty(pdjData);
            declarativeActions.dataRowsCount = rdjData.data.length;
            declarativeActions.buttons = [];
            for (const pdjAction of pdjActions) {
              const index = backendActions.findIndex(item => item.id === pdjAction.name);
              if (index !== -1) {
                const button = {};
                button['name'] = pdjAction.name;
                button['label'] = pdjAction.label;
                button['iconFile'] = backendActions[index].iconFile;
                button['disabled'] = true;
                if (CoreUtils.isNotUndefinedNorNull(backendActions[index].constraint)) {
                  button['constraint'] = backendActions[index].constraint;
                }
                if (CoreUtils.isNotUndefinedNorNull(pdjAction.affectsChangeManager)) {
                  button['affectsChangeManager'] = pdjAction.affectsChangeManager;
                }
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
                    if (menu.actions) {
                      menuItem['menus'] = [];
                      for (const subMenu of menu.actions) {
                        const subMenuItem = {
                          name: subMenu.name,
                          label: subMenu.label,
                          disabled: (declarativeActions.rowSelectionRequired)
                        };
                        if (CoreUtils.isNotUndefinedNorNull(subMenu.polling)) {
                          subMenuItem['polling'] = getActionPollingObject(subMenu);
                        }
                        menuItem.menus.push(subMenuItem);
                      }
                    }
                  }
                  button.disabled = getParentActionsDisabledState(button);
                }
                declarativeActions.buttons.push(button);
              }
            }
            declarativeActions['willAffectChangeManager'] = (declarativeActions.buttons.filter(item => CoreUtils.isNotUndefinedNorNull(item.affectsChangeManager)).length > 0);
            declarativeActions['hasActionConstraints'] = (declarativeActions.buttons.filter(item => CoreUtils.isNotUndefinedNorNull(item?.constraint?.type) && item.constraint.type === 'rowIndex').length > 0);
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

      getFrontendActionsHelpColumns: (group) => {
        return frontendActions.filter(item => item.group === group);
      },

      getPDJTypesHelpColumns: (pdjData) => {
        const traverseActions = (actions, pdjTypesHelpColumns) => {
          let children = [];
          return actions.map((child) => {
            if (child.detailedHelpHTML) {
              pdjTypesHelpColumns.push(child);
            }

            if (child.actions) {
              children = [...child.actions];
              traverseActions(children, pdjTypesHelpColumns);
            }
          });
        };

        let pdjTypesHelpColumns = [];
        const pdjActions = getPDJActions(pdjData);

        traverseActions([...pdjActions], pdjTypesHelpColumns);

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

      getPDJActionPollingObject: (rdjData, declarativeActions, action) => {
        return getPDJActionPolling(declarativeActions, action);
      },

      getActionEndpoint: (rdjActions, action) => {
        return getActionEndpoint(rdjActions, action);
      },

      getActionInputFormRequest: (rdjData, declarativeActions, action, rowKeyName) => {
        delete declarativeActions.inputForm;
        const result = getActionInputFormRequest(rdjData, declarativeActions.checkedRows, action, rowKeyName);
        if (CoreUtils.isNotUndefinedNorNull(result.dataPayload.rows)) {
          declarativeActions['inputForm'] = {rows: result.dataPayload.rows};
        }
        return result;
      },

      getActionIconFile: (action) => {
        let iconFile = 'action-empty-icon-blk_24x24';
        const settingsActions = [...backendActions, ...frontendActions];
        if (settingsActions.length > 0) {
          const index = settingsActions.findIndex(item => item.id === action);
          if (index !== -1) {
            iconFile = settingsActions[index].iconFile;
          }
        }
        return iconFile;
      },

      performActionOnCheckedRows: (rdjData, declarativeActions, options) => {
        if (options.isDeleteAction) {
          return performDeleteAction(rdjData, declarativeActions, options);
        }
        else if (isExecutionOrderConstrainedAction(options.action)) {
          return performExecutionOrderConstrainedAction(rdjData, declarativeActions, options);
        }
        else {
          return defaultPerformAction(rdjData, declarativeActions, options);
        }
      },

      submitActionInputForm: (submitResults, checkedRows, endpoint, options) => {
        if (CoreUtils.isNotUndefinedNorNull(options.multipartForm)) {
          const formData = getActionInputMultipartFormDataPayload(
            options.multipartForm,
            submitResults,
            checkedRows
          );
          return multipartPostActionData(options.label, endpoint, formData);
        }
        else {
          const dataPayload = getActionInputDataPayload(
            submitResults,
            checkedRows
          );
          if (checkedRows === null || checkedRows.size === 0) {
            return postActionData(options.label, endpoint, dataPayload, false);
          }
          return postActionData(options.label, endpoint, dataPayload);
        }
      }

    };

  }
);