/**
 * @license
 * Copyright (c) 2022, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 *
 * @typedef {{type: 'above'|'below'|'at', checkedItem: {uid: string, parentUid: string}, addedItem?: {uid: string, parentUid: string}, operator?: 'or'|'and'|undefined}} Insertion
 * @type {Insertion}
 * @typedef {{value: string, array: boolean, displayName: string, descriptionHTML: string, optional: boolean, type?: string, placeholder?: string}} Argument
 * @type {Argument}
 * @typedef {{uid: string, parentUid: string, isLastSibling: boolean, isLastCondition: boolean, operator: 'none'|'and'|'or'|undefined, joiner: 'none'|'and'|'or'|undefined, expression: string, options: {negated: boolean, combined: boolean, deleted: boolean, insertion?: Insertion},children?:[PolicyCondition],predicate: {name: string, arguments:[Argument],descriptionHTML: string,displayName: string}}} PolicyCondition
 * @type {PolicyCondition}
 */
define(['knockout', './controller', 'wrc-frontend/microservices/policy-management/condition-phraser', 'wrc-frontend/core/utils'],
  function (ko, Controller, ConditionPhraser, CoreUtils) {

    /**
     * Returns a new "empty" `PolicyCondition`
     * <p><b>IMPORTANT:&nbsp;&nbsp;&nbsp;Do not alter default value for the `operator` property! It is intentionally set to 'none', and must remain that way in order for things to work properly.</b></p>
     * @returns {PolicyCondition}
     * @private
     */
    function getEmptyPolicyCondition() {
      return  {
        uid: '0',
        parentUid: '-1',
        isLastSibling: false,
        isLastCondition: false,
        operator: 'none',
        joiner: undefined,
        expression: '',
        options: {
          negated: false,
          combined: false,
          deleted: false,
          insertion: {
            type: 'at',
            checkedItem: {uid: '0', parentUid: '-1'}
          }
        },
        predicate: {
          name: '',
          arguments: [{value: '', array: true,  displayName: '', descriptionHTML: ''}],
          descriptionHTML: '',
          displayName: ''
        }
      };
    }

    /**
     *
     * @param {PolicyCondition} policyCondition
     * @returns {string}
     * @private
     */
    function getConditionPhrase(policyCondition) {
      return ConditionPhraser.getPredicateClause(policyCondition);
    }

    function showWizardPage(wizard, startPage, name, viewParams, wizardPageModuleConfig) {
      if (CoreUtils.isUndefinedOrNull(viewParams.data.policyCondition)) {
        const policyCondition = getEmptyPolicyCondition();
        policyCondition.options.insertion = viewParams.data.insertion;
        viewParams.data['policyCondition'] = policyCondition;
      }

      const results = {
        succeeded: false,
        data: {policyCondition: viewParams.data.policyCondition}
      };

      return new Promise(function (resolve) {
        function onClose(reply) {
          // Remove event listeners
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          wizard.removeEventListener('keyup', onKeyUp);
          // Destroy moduleConfig
          wizardPageModuleConfig({ view: [], viewModel: null });
          // Assign reply to results.succeeded
          results.succeeded = reply;
          // Return results in a Promise.resolve().
          resolve(results);
        }

        function onEnterKey() {
          let preventExit = false;
          let ojInputs = wizard.querySelectorAll('.cfe-wizard-combobox-many');
          let ojInputsArray = Array.from(ojInputs);
          if (ojInputsArray.length > 0) {
            const ojInputs1 = wizard.querySelectorAll('.oj-combobox-selected-choice');
            const ojInputsArray1 = Array.from(ojInputs1);
            preventExit = (ojInputsArray1.length === 0);
          }
          else {
            ojInputs = wizard.querySelectorAll('.cfe-wizard-input-required, .cfe-wizard-select-one');
            ojInputsArray = Array.from(ojInputs);
            const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => ojInput.value !== null && ojInput.value.length > 0);
            preventExit = (ojInputs.length !== ojInputsArrayFiltered.length);
          }
          if (preventExit) {
            viewParams.displayFailureMessage(viewParams.i18n.messages.requiredFieldsMissing.detail);
            ojInputs[0].focus();
          }
          return preventExit;
        }

        function okClickHandler(event) {
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          wizard.close();
        }

        function cancelClickHandler() {
          viewParams.clearFailureMessage();
          onClose(false);
          wizard.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
              // Treat pressing the "Enter" key as clicking the "OK" button
              okClickHandler(event);
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
            case 'Escape':
              // Treat pressing the "Escape" key as clicking the "Cancel" button
              cancelClickHandler();
              break;
          }
        }

        const okBtn = document.getElementById('dlgOkBtn23');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn23');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        wizard.addEventListener('keyup', onKeyUp);

        const setWizardPageModuleConfig = (name, viewParams) => {
          return Controller.loadModule(name, viewParams);
        };

        function handleStepEvent(stepEvent) {
          switch (stepEvent.type) {
            case 'start-wizard':
              viewParams.clearFailureMessage();
              viewParams['startPage'] = stepEvent.data.startPage;
              viewParams['dispatchStepEvent'] = handleStepEvent;
              viewParams['getConditionPhrase'] = getConditionPhrase;
              setWizardPageModuleConfig(name, viewParams)
                .then(moduleConfigPromise => {
                  wizardPageModuleConfig(moduleConfigPromise);
                  if (!wizard.isOpen()) wizard.open();
                });
              break;
            case 'add-predicate-chosen':
              results.data.policyCondition.predicate.name = stepEvent.data.name;
              results.data.policyCondition.predicate['arguments'] = stepEvent.data['arguments'];
              results.data.policyCondition.predicate.descriptionHTML = stepEvent.data.descriptionHTML;
              results.data.policyCondition.predicate.displayName = stepEvent.data.displayName;
              results.data.policyCondition.expression = getConditionPhrase(results.data.policyCondition);
              break;
            case 'argument-values-changed':
              results.data.policyCondition = stepEvent.data;
              break;
          }
        }

        handleStepEvent({
          type: 'start-wizard',
          data: {startPage: startPage}
        });
      });
    }

    return {
      startWizard: (startPage, wizardPageModuleConfig, viewParams) => {
        const wizard = document.getElementById('policyEditorWizard');
        return showWizardPage(wizard, startPage, 'policy-editor-wizard-page', viewParams, wizardPageModuleConfig);
      }
    }

  }
);