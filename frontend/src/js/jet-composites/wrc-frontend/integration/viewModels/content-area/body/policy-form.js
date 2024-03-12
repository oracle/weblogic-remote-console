/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'wrc-frontend/microservices/page-definition/form-layouts',
  'wrc-frontend/microservices/page-definition/fields',
  'wrc-frontend/core/runtime',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/microservices/policy-management/policy-manager',
  'wrc-frontend/microservices/policy-management/policy-data',
  'wrc-frontend/microservices/page-definition/types',
  'wrc-frontend/microservices/page-definition/pages',
  'wrc-frontend/microservices/page-definition/utils',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/cbe-types',
  'wrc-frontend/core/cbe-utils',
  'wrc-frontend/core/utils',
  'wrc-frontend/core/types',
  'ojs/ojlogger'
],
  function (
    oj,
    ko,
    PageDefinitionFormLayouts,
    PageDefinitionFields,
    Runtime,
    MessageDisplaying,
    PolicyManager,
    PolicyData,
    PageDataTypes,
    PageDefinitionPages,
    PageDefinitionUtils,
    ViewModelUtils,
    CbeTypes,
    CbeUtils,
    CoreUtils,
    CoreTypes,
    Logger
  ) {

    function PolicyForm(policyData, section, rdjUrl) {
      this.policyData = policyData;
      this.section = section;
      this.rdjUrl = rdjUrl
      var _resetPolicyEditor = false;
      this.resetPolicyEditor = (value) => {
        if (CoreUtils.isNotUndefinedNorNull(value) && typeof value === 'boolean') {
          _resetPolicyEditor = value;
        }
        return _resetPolicyEditor;
      };
    }

    function getActionButtonSet() {
      let actionButtonSet;
      if (CoreUtils.isNotUndefinedNorNull(PolicyForm.prototype.i18n)) {
        actionButtonSet = {
          buttonsets: [
            {
              name: 'policyActionsIconbar',
              className: 'cfe-buttonset',
              buttonClickListener: 'policyActionMenuClickListener',
              buttonSetItems: [
                {
                  type: 'buttonMenu',
                  name: 'addCondition',
                  label: PolicyForm.prototype.i18n.buttonsets.action.addCondition.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.addCondition.iconFile,
                  launchMenuListener: 'launchAddConditionMenu',
                  menuClickListener: 'addConditionMenuClickListener',
                  menuItems: [
                    {name: 'above', label: PolicyForm.prototype.i18n.buttonMenus.action.addCondition.above.label, observable: 'actionButtonSet.buttonSetItems.above.disabled'},
                    {name: 'below', label: PolicyForm.prototype.i18n.buttonMenus.action.addCondition.below.label, observable: 'actionButtonSet.buttonSetItems.below.disabled'}
                  ]
                },
                {type: 'button', name: 'combine', label: PolicyForm.prototype.i18n.buttonsets.action.combine.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.combine.iconFile, observable: 'actionButtonSet.buttonSetItems.combine.disabled'},
                {type: 'button', name: 'uncombine', label: PolicyForm.prototype.i18n.buttonsets.action.uncombine.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.uncombine.iconFile, observable: 'actionButtonSet.buttonSetItems.uncombine.disabled'},
//MLW                {type: 'button', name: 'moveup', label: PolicyForm.prototype.i18n.buttonsets.action.moveup.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.moveup.iconFile, observable: 'actionButtonSet.buttonSetItems.moveup.disabled'},
//MLW                {type: 'button', name: 'movedown', label: PolicyForm.prototype.i18n.buttonsets.action.movedown.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.movedown.iconFile, observable: 'actionButtonSet.buttonSetItems.movedown.disabled'},
                {type: 'button', name: 'remove', label: PolicyForm.prototype.i18n.buttonsets.action.remove.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.remove.iconFile, observable: 'actionButtonSet.buttonSetItems.remove.disabled'},
                {type: 'button', name: 'negate', label: PolicyForm.prototype.i18n.buttonsets.action.negate.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.negate.iconFile, observable: 'actionButtonSet.buttonSetItems.negate.disabled'},
                {type: 'button', name: 'reset', label: PolicyForm.prototype.i18n.buttonsets.action.reset.label, iconFile: PolicyForm.prototype.i18n.buttonsets.action.reset.iconFile, observable: 'actionButtonSet.buttonSetItems.reset.disabled'}
              ]
            }
          ]
        };
      }
      return actionButtonSet;
    }

    function onConditionCheckedChanged(event) {
      const states = [
        {name: 'above', disabled: event.detail.notification.disabled.above},
        {name: 'below', disabled: event.detail.notification.disabled.below},
        {name: 'combine', disabled: event.detail.notification.disabled.combine},
        {name: 'uncombine', disabled: event.detail.notification.disabled.uncombine},
        {name: 'moveup', disabled: event.detail.notification.disabled.moveup},
        {name: 'movedown', disabled: event.detail.notification.disabled.movedown},
        {name: 'remove', disabled: event.detail.notification.disabled.remove},
        {name: 'negate', disabled: event.detail.notification.disabled.negate},
        {name: 'reset', disabled: event.detail.notification.disabled.reset}
      ];
      this.setButtonSetItemsState(event.detail.notification.actionItems, states);
    }

    function validatePolicyChangeFailureHandler(response, results, action) {
      if (CoreUtils.isError(response)) {
        MessageDisplaying.displayMessage({
          severity: 'error',
          summary: ViewModelUtils.i18n.labels.unexpectedErrorResponse.value,
          detail: response.message
        });
      }
      else if (CoreUtils.isNotUndefinedNorNull(response) &&
        CoreUtils.isNotUndefinedNorNull(response.failureReason)
      ) {
        if (CoreUtils.isError(response.failureReason)) {
          MessageDisplaying.displayMessage({
            severity: 'error',
            summary: ViewModelUtils.i18n.labels.unexpectedErrorResponse.value,
            detail: response.failureReason.message
          });
        }
        else if (CoreUtils.isNotUndefinedNorNull(response.transport) &&
          CoreUtils.isNotUndefinedNorNull(response.transport.status) &&
          response.transport.status === 400
        ) {
          const controlElement = document.getElementById('wrc-policy-editor');

          if (controlElement !== null) {
            controlElement.getWizardPageInput(
              action,
              results.predicateItem,
              response.body.messages[0].message
            );
          }
        }
        else {
          MessageDisplaying.displayMessage({
            severity: response.body.messages[0].severity,
            summary: response.failureReason,
            detail: response.body.messages[0].message
          });
        }
      }
    }

    function policyChangeSuccessHandler(policyConditions, controlElement) {
      controlElement.setPolicyConditions(policyConditions);
      controlElement.refreshPolicyConditions();
    }

    function onPolicyConditionAdded(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.addPolicyCondition(
          this.policyData,
          this.section,
          event.detail.target
        );

        if (results.succeeded) {
/*
//MLW
          PolicyManager.validatePolicyChange(this.policyData, results.parsedExpression, results.stringExpression, this.rdjUrl)
            .then(reply => {
              policyChangeSuccessHandler(
                results.policyConditions,
                controlElement
              );
              controlElement.sendFieldValueChangedEvent(
                this.section,
                results.parsedExpression
              );
            })
            .catch(response => {
              validatePolicyChangeFailureHandler(
                response,
                results,
                event.detail.notification.action
              );
            });
*/
          policyChangeSuccessHandler(
            results.policyConditions,
            controlElement
          );
          controlElement.sendFieldValueChangedEvent(
            this.section,
            results.parsedExpression
          );
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function onPolicyConditionModified(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.updatePolicyCondition(
          this.policyData,
          this.section,
          event.detail.target
        );

        if (results.succeeded) {
/*
//MLW
          PolicyManager.validatePolicyChange(this.policyData, results.parsedExpression, results.stringExpression, this.rdjUrl)
            .then(reply => {
              policyChangeSuccessHandler(
                results.policyConditions,
                controlElement
              );
              controlElement.sendFieldValueChangedEvent(
                this.section,
                results.parsedExpression
              );
            })
            .catch(response => {
              validatePolicyChangeFailureHandler(
                response,
                results,
                event.detail.notification.action
              );
            });
*/
          policyChangeSuccessHandler(
            results.policyConditions,
            controlElement
          );
          controlElement.sendFieldValueChangedEvent(
            this.section,
            results.parsedExpression
          );
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function onPolicyConditionsCombined(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.combinePolicyConditions(
          this.policyData,
          this.section,
          event.detail.notification.combinedUids,
          event.detail.notification.relocatedUids
        );

        if (results.succeeded) {
          policyChangeSuccessHandler(
            results.policyConditions,
            controlElement
          );
          controlElement.sendFieldValueChangedEvent(
            this.section,
            results.parsedExpression
          );
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function onPolicyConditionsUncombined(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.uncombinePolicyConditions(
          this.policyData,
          this.section,
          event.detail.notification.combinedUids
        );

        if (results.succeeded) {
          const fieldValue = {
            Policy: {
              value: {
                parsedExpression: results.parsedExpression
              }
            }
          };
          PolicyManager.submitPolicyChange(fieldValue, results.stringExpression, this.rdjUrl)
            .then(reply => {
              controlElement.sendPolicyEditorResetEvent();
            })
            .catch(response => {
              validatePolicyChangeFailureHandler(
                  response,
                  results,
                  event.detail.notification.action
              );
            });
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function onPolicyConditionMoved(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.moveConditions(
          this.policyData,
          this.section,
          event.detail.notification.recomputedUids
        );

        if (results.succeeded) {
/*
//MLW
          policyChangeSuccessHandler(
            results.policyConditions,
            controlElement
          );
          controlElement.sendFieldValueChangedEvent(
            this.section,
            results.parsedExpression
          );
*/
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function onPolicyConditionRemoved(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.removeConditions(
          this.policyData,
          this.section,
          event.detail.notification.removedItems
        );

        if (results.succeeded) {
          policyChangeSuccessHandler(
            results.policyConditions,
            controlElement
          );
          controlElement.performAutoUncombineAction();
          controlElement.sendFieldValueChangedEvent(
            this.section,
            results.parsedExpression
          );
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function onPolicyConditionNegated(event) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const results = this.policyData.negateConditions(
          this.policyData,
          this.section,
          event.detail.notification.negatedItems
        );

        if (results.succeeded) {
          policyChangeSuccessHandler(
            results.policyConditions,
            controlElement
          );
          controlElement.sendFieldValueChangedEvent(
            this.section,
            results.parsedExpression
          );
        }
        else {
          MessageDisplaying.displayMessagesAsHTML(results.failure.messages);
        }
      }
    }

    function performAddConditionAction(action, location = 'above') {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const insertion = {};
        // Get array of checked items
        const checkedUids = controlElement.getCheckedPolicyConditionUids();

        if (checkedUids.length > 0) {
          insertion['type'] = location;
          insertion['checkedItem'] = {uid: checkedUids[0].uid, parentUid: checkedUids[0].parentUid};
        }
        else {
          insertion['type'] = 'at';
          insertion['checkedItem'] = {uid: '0', parentUid: '-1'};
        }
        const params = {
          id: 'addCondition',
          event: 'policyConditionAdded',
          pages: ['choose-predicate','manage-argument-values'],
          insertion: insertion
        };
        // Call control method passing params for the
        // argument value.
        controlElement.performPolicyEditorAction(params);
      }
    }

    function performCombineConditionAction(action) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const params = { id: action};
        controlElement.performPolicyEditorAction(params);
      }
    }

    function performUncombineConditionAction(action) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const checkedUids = controlElement.getCheckedPolicyConditionUids();

        if (checkedUids.length > 0) {
          const params = {
            id: action,
            checkedItems: checkedUids
          };
          controlElement.performPolicyEditorAction(params);
        }
      }
    }

    function performMoveConditionAction(action, direction = 'movedown') {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const params = {
          id: action,
          direction: direction
        };

        controlElement.performPolicyEditorAction(params);
      }
    }

    function performRemoveConditionAction(action) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const checkedUids = controlElement.getCheckedPolicyConditionUids();

        if (checkedUids.length > 0) {
          const params = {
            id: action,
            checkedItems: checkedUids
          };
          controlElement.performPolicyEditorAction(params);
        }
      }
    }

    function performNegateConditionAction(action) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        const checkedUids = controlElement.getCheckedPolicyConditionUids();

        if (checkedUids.length > 0) {
          const params = {
            id: action
          };
          controlElement.performPolicyEditorAction(params);
        }
      }
    }

    function performResetConditionAction(action) {
      const controlElement = document.getElementById('wrc-policy-editor');

      if (controlElement !== null) {
        controlElement.sendPolicyEditorResetEvent();
      }
    }

    function performAction(action) {
      switch(action) {
        case 'addCondition':
          performAddConditionAction.call(this, action);
          break;
        case 'moveup':
          performMoveConditionAction.call(this, action, 'moveup');
          break;
        case 'movedown':
          performMoveConditionAction.call(this, action, 'movedown');
          break;
        case 'combine':
          performCombineConditionAction.call(this, action);
          break;
        case 'uncombine':
          performUncombineConditionAction.call(this, action);
          break;
        case 'remove':
          performRemoveConditionAction.call(this, action);
          break;
        case 'negate':
          performNegateConditionAction.call(this, action);
          break;
        case 'reset':
          performResetConditionAction.call(this, action);
          break;
      }
    }

    PolicyForm.prototype = {
      i18n: {
        'icons': {
          'separator': { iconFile: 'separator-vertical_10x24' }
        },
        'buttonsets': {
          'action': {
            'addCondition': {id: 'addCondition', iconFile: 'policy-add-condition-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.addCondition.label')
            },
            'combine': {id: 'combine', iconFile: 'policy-combine-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.combine.label')
            },
            'uncombine': {id: 'uncombine', iconFile: 'policy-uncombine-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.uncombine.label')
            },
            'moveup': {id: 'moveup', iconFile: 'policy-moveup-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.moveup.label')
            },
            'movedown': {id: 'movedown', iconFile: 'policy-movedown-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.movedown.label')
            },
            'remove': {id: 'remove', iconFile: 'policy-delete-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.remove.label')
            },
            'negate': {id: 'negate', iconFile: 'policy-negate-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.negate.label')
            },
            'reset': {id: 'reset', iconFile: 'policy-reset-brn_24x24', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-policy-management.menus.action.reset.label')
            }
          }
        },
        messages: {
          requiredFieldsMissing: {detail: oj.Translations.getTranslatedString('wrc-policy-management.messages.requiredFieldsMissing.detail')},
          argumentValueHasWrongFormat: {summary: oj.Translations.getTranslatedString('wrc-policy-management.messages.argumentValueHasWrongFormat.summary', '{0}')},
          conditionHasNoArgValues: {summary: oj.Translations.getTranslatedString('wrc-policy-management.messages.conditionHasNoArgValues.summary')},
          conditionAlreadyExists: {summary: oj.Translations.getTranslatedString('wrc-policy-management.messages.conditionAlreadyExists.summary')}
        },
        'buttonMenus': {
          'action': {
            'addCondition': {
              'above': {'label': oj.Translations.getTranslatedString('wrc-policy-management.buttonMenus.action.addCondition.above.label')},
              'below': {'label': oj.Translations.getTranslatedString('wrc-policy-management.buttonMenus.action.addCondition.below.label')}
            }
          }
        },
        'contextMenus': {
          'action': {
            'addCondition': {
              'at': {'label': oj.Translations.getTranslatedString('wrc-policy-management.contextMenus.action.addCondition.at.label')},
              'above': {'label': oj.Translations.getTranslatedString('wrc-policy-management.contextMenus.action.addCondition.above.label')},
              'below': {'label': oj.Translations.getTranslatedString('wrc-policy-management.contextMenus.action.addCondition.below.label')}
            }
          }
        },
        AddLocation: Object.freeze({
          ABOVE_CHECKED_ITEM: 'above',
          BELOW_CHECKED_ITEM: 'below'
        }),
        MoveDirection: Object.freeze({
          UP: 'moveup',
          DOWN: 'movedown'
        }),
        labels: {
          policyConditions: oj.Translations.getTranslatedString('wrc-policy-editor.labels.policyConditions.value'),
          MonthDay: oj.Translations.getTranslatedString('wrc-policy-editor.labels.monthDay.value'),
          DateTime: oj.Translations.getTranslatedString('wrc-policy-editor.labels.dateTime.value'),
          Time: oj.Translations.getTranslatedString('wrc-policy-editor.labels.time.value'),
          GMTOffset: oj.Translations.getTranslatedString('wrc-policy-editor.labels.gmtOffset.value'),
          WeekDay: oj.Translations.getTranslatedString('wrc-policy-editor.labels.weekDay.value'),
          not: oj.Translations.getTranslatedString('wrc-policy-editor.labels.not.value'),
          combination: oj.Translations.getTranslatedString('wrc-policy-editor.labels.combination.value'),
          nodata: {
            Policy: oj.Translations.getTranslatedString('wrc-policy-editor.labels.nodata.Policy.value'),
            DefaultPolicy: oj.Translations.getTranslatedString('wrc-policy-editor.labels.nodata.DefaultPolicy.value')
          }
        },
        tables: {
          'policyConditions': {
            'columns': {
              'header': {
                'operator': oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.columns.header.operator'),
                'expression': oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.columns.header.expression')
              }
            }
          },
          'dropdowns': {
            'operator': {
              'and': oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.dropdowns.operator.and'),
              'or': oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.dropdowns.operator.or')
            }
          }
        },
        wizard: {
          title: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.title'),
          buttons: {
            ok: {
              disabled: ko.observable(true),
              label: oj.Translations.getTranslatedString('wrc-common.buttons.ok.label')
            },
            cancel: {
              disabled: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
            }
          },
          pages: {
            choosePredicate: {
              header: {
                title: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.choosePredicate.header.title'),
                instructions: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.choosePredicate.header.instructions')
              },
              body: {
                labels: {
                  predicateList: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.choosePredicate.body.labels.predicateList')
                },
                help: {
                  predicateList: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.choosePredicate.body.help.predicateList')
                }
              }
            },
            manageArgumentValues: {
              header: {
                instructions: ko.observable(oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.manageArgumentValues.header.instructions'))
              },
              body: {
                labels: {
                  arguments: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.manageArgumentValues.body.labels.arguments'),
                  conditionPhrase: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.manageArgumentValues.body.labels.conditionPhrase'),
                  negate: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.manageArgumentValues.body.labels.negate')
                },
                help: {
                  negate: oj.Translations.getTranslatedString('wrc-policy-editor.wizard.pages.manageArgumentValues.body.help.negate')
                }
              }
            }
          }
        }
      },

      /**
       *
       * @param {{labelWidthPcnt: string, maxColumns: string, name?: string, direction?: "row"|"column", wrapColSpan?: boolean, labelEdge?: "inside"|"start"|"top", isReadOnly?: boolean}} options
       * @param {object} pdjTypes
       * @param {object} rdjData
       * @param {object} pdjData
       * @param {function} populateCallback
       * @returns {HTMLElement}
       */
      createPolicyFormLayout: function (options, pdjTypes, rdjData, pdjData, populateCallback) {
        this.section = pdjData.sliceForm.properties[0].name;
        // Get the "root" formLayout
        const rootFormLayout = PageDefinitionFormLayouts.createSingleColumnFormLayout(options);

        const results = {};

        const params = getActionButtonSet();
        if (CoreUtils.isNotUndefinedNorNull(params)) {
          // Create "Action" buttonset
          results['html'] = PageDefinitionFields.createButtonSets(params);
          results['buttonSetItems'] = {
            'above': {disabled: ko.observable(false)},
            'below': {disabled: ko.observable(false)},
            'combine': {disabled: ko.observable(false)},
            'uncombine': {disabled: ko.observable(false)},
            'moveup': {disabled: ko.observable(false)},
            'movedown': {disabled: ko.observable(false)},
            'remove': {disabled: ko.observable(false)},
            'negate': {disabled: ko.observable(false)},
            'reset': {disabled: ko.observable(false)}
          };
        }

        const actionButtonSetBindDom = document.createElement('oj-bind-dom');
        actionButtonSetBindDom.setAttribute('config', '[[actionButtonSet.html]]');

        // The action buttonset needs to be appended to the form
        // content header, so it will be frozen above the scrollable
        // "Policy Conditions" table.
        const formContentHeader = document.querySelector('div.cfe-table-form-content-header');
        if (formContentHeader !== null) formContentHeader.append(actionButtonSetBindDom);

        // Need to get HTML help instructions, which are assigned
        // to the title attribute of the circle-question iconFont.
        const helpInstruction = PageDefinitionFields.createHelpInstruction(this.section, pdjTypes);

        // Create label for our cfe-policy-editor custom JET control.
        const labelEle = PageDefinitionFields.createLabel(this.section, pdjTypes, helpInstruction);
        // Append the label to the form layout
        rootFormLayout.append(labelEle);

        // Create <cfe-policy-editor> element (i.e. custom JET composite(
        const field = PageDefinitionFields.createPolicyEditor(
          'wrc-policy-editor',
          {readonly: options.isReadOnly, width: '20.625rem'}
        );
        field.setAttribute('data-parsed-expression-section', '');
        rootFormLayout.append(field);

        // Create a "temp" form layout for populateFormLayout call.
        const formLayout = PageDefinitionFormLayouts.createSingleColumnFormLayout(options);

        // The "root" form layout contains everything we need for the
        // slice page, but we still need to invoke populateFormLayout
        // because 1) it creates the valueSubscriptions for "Name",
        // "Policy" and "DefaultPolicy", and 2) we have a custom
        // layout, but form.js is still where rendering and knockout
        // variables handling is done.
        populateCallback(pdjData.sliceForm.properties, formLayout, pdjTypes, rdjData.data, options.isSingleColumn, options.isReadOnly);

        // Store "root" form layout in results
        results['formLayout'] = rootFormLayout;

        // All done, so return "root" form layout.
        return results;
      },

      /**
       * @param {object} policyData
       * @param {object} pdjTypes
       * @param {object} rdjData
       * @param {object} pdjData
       * @param {object} buttonSetItems
       * @param {{'fieldValueChanged': function, 'policyEditorReset': function}} formCallbacks
       */
      renderPolicyForm: function (policyData, pdjTypes, rdjData, pdjData, buttonSetItems, formCallbacks) {
        const controlElement = document.getElementById('wrc-policy-editor');

        if (controlElement !== null) {
          const field = document.querySelector('oj-label[for=\'wrc-policy-editor\']');
          if (field !== null) {
            field.setAttribute('help.definition', pdjTypes.getHelpInstruction(this.section));
            field.setAttribute('data-detailed-help', pdjTypes.getHelpDetailed(this.section));
          }

          controlElement.operatorLegalValues = [
            {value: 'none', label: ''},
            {
              value: 'or',
              label: oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.dropdowns.operator.or')
            },
            {
              value: 'and',
              label: oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.dropdowns.operator.and')
            }
          ];

          controlElement.tableColumnHeaders = {
            operator: oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.columns.header.operator'),
            expression: oj.Translations.getTranslatedString('wrc-policy-editor.tables.policyConditions.columns.header.expression')
          };

          // Disable all of the menu items in the "Action"
          // buttonset, except 'addCondition'.
          const states = [
            {name: 'above', disabled: false},
            {name: 'below', disabled: false},
            {name: 'combine', disabled: true},
            {name: 'uncombine', disabled: true},
            {name: 'moveup', disabled: true},
            {name: 'movedown', disabled: true},
            {name: 'remove', disabled: true},
            {name: 'negate', disabled: true},
            {name: 'reset', disabled: false}
          ];

          this.setButtonSetItemsState(buttonSetItems, states);

          controlElement.setActionItems(buttonSetItems);

          controlElement.fieldValueChangedCallback(formCallbacks.fieldValueChanged);
          controlElement.policyEditorResetCallback(formCallbacks.policyEditorReset);

          // Set event functions that serve as callbacks
          controlElement.onConditionCheckedChanged = (event) => {
            onConditionCheckedChanged.call(this, event);
          };
          controlElement.onPolicyConditionAdded = (event) => {
            onPolicyConditionAdded.call(this, event);
          };
          controlElement.onPolicyConditionModified = (event) => {
            onPolicyConditionModified.call(this, event);
          };
          controlElement.onPolicyConditionMoved = (event) => {
            onPolicyConditionMoved.call(this, event);
          };
          controlElement.onPolicyConditionsCombined = (event) => {
            onPolicyConditionsCombined.call(this, event);
          };
          controlElement.onPolicyConditionsUncombined = (event) => {
            onPolicyConditionsUncombined.call(this, event);
          };
          controlElement.onPolicyConditionRemoved = (event) => {
            onPolicyConditionRemoved.call(this, event);
          };
          controlElement.onPolicyConditionNegated = (event) => {
            onPolicyConditionNegated.call(this, event);
          };

          controlElement.readonly = (CoreUtils.isUndefinedOrNull(pdjData.sliceForm.properties[0]?.readOnly) ? false : pdjData.sliceForm.properties[0].readOnly);

          controlElement.setTranslationStrings(this.section, PolicyForm.prototype.i18n);
          controlElement.setSupportedPredicatesList(policyData.getSupportedPredicatesList(this.section, PolicyForm.prototype.i18n));

          if (this.resetPolicyEditor()) {
            this.policyData = PolicyManager.createPolicyData(rdjData);
            policyData = this.policyData;
            this.resetPolicyEditor(false);
          }

          const policyConditions = policyData.getPolicyConditions(this.section);
          controlElement.setPolicyConditions(policyConditions);
        }
      },

      actionMenuClickListener: function (event) {
        event.preventDefault();
        const fauxEvent = {
          currentTarget: {
            id: event.target.id,
            innerText: event.target.innerText,
            attributes: event.target.attributes
          }
        };
        this.actionButtonClicked(fauxEvent);
      },

      actionButtonClicked: function (event) {
        if (event.currentTarget.id === 'addCondition') {
          performAddConditionAction.call(this, event.currentTarget.id);
        }
        else {
          performAction.call(this, event.currentTarget.id);
        }
      },

      addConditionMenuClickListener: function (event) {
        performAddConditionAction.call(this, 'addCondition', event.detail.selectedValue);
      },

      launchAddConditionMenu: function (event) {
        event.preventDefault();

        const controlElement = document.getElementById('wrc-policy-editor');

        if (controlElement !== null) {
          if (controlElement.readonly) {
            return ViewModelUtils.cancelEventPropagation(event);
          }

          const checkedUids = controlElement.getCheckedPolicyConditionUids();
          if (checkedUids.length > 0) {
            // One or more rows are checked, so launch the insert
            // location menu. The DOM selector for the menu is in
            // the data-menu-id attribute of event.currentTarget..
            const menuId = event.currentTarget.attributes['data-menu-id'].value;
            // Show the menu.
            document.getElementById(menuId).open(event);
          }
          else {
            // No rows are checked, so call without the location
            // parameter.
            performAddConditionAction.call(this, 'addCondition');
          }
        }

      },

      /**
       * Sets the `disabled` attribute on the buttons of the 'Action' buttonset.
       * @param {object} buttonSetItems
       * @param {[{name: string, disabled: boolean}]} states - Where `name` is the name of a menu item, and `disabled` has the value of true or false
       * @example:
       *  const states = [
       *    {name: 'above', disabled: false},
       *    {name: 'below', disabled: false},
       *    {name: 'combine', disabled: true},
       *    {name: 'uncombine', disabled: true},
       *    {name: 'moveup', disabled: true},
       *    {name: 'movedown', disabled: true},
       *    {name: 'remove', disabled: true},
       *    {name: 'negate', disabled: true},
       *    {name: 'reset', disabled: false}
       *  ];
       *  self.policyForm.setButtonSetItemsState(buttonSetItems, states);
       */
      setButtonSetItemsState: (buttonSetItems, states) => {
        for (const state of states) {
          buttonSetItems[state.name].disabled(state.disabled);
        }
      },

      importPolicyData: function (filename, policyData = undefined) {
        // TODO: Allow user to set this.policyData instance
        //      variable from a JSON file, or the policyData
        //      parameter. This facilitates working with
        //      verification use cases, and provides a
        //      a mechanism for creating a policy from
        //      a previously exported policy.
      },

      exportPolicyData: function (filename, policyData = undefined) {
        // TODO: Allow user to write this.policyData instance
        //      variable (or the policyData) out to a JSON file.
        //      This facilitates working with verification use
        //      cases, and provides a mechanism for saving a
        //      policy that can later be imported.
      }

    };

    PolicyForm.prototype.renderActionsStrip = function (visibility = true) {
      const div = document.querySelector('.cfe-buttonset');
      if (div !== null) {
        div.style.display = (visibility ? 'inline-flex' : 'none');
      }
    };

    // Return PolicyForm constructor function
    return PolicyForm;
  }
);