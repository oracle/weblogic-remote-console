/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'knockout',
  'ojs/ojcontext',
  'ojs/ojarraydataprovider',
  'wrc-frontend/core/utils',
  'ojs/ojlabel',
  'ojs/ojformlayout',
  'ojs/ojselectsingle',
  'ojs/ojselectcombobox',
  'ojs/ojinputtext'
],
  function(
    ko,
    Context,
    ArrayDataProvider,
    CoreUtils
  ) {

    function PolicyEditorWizardPage(viewParams) {
      const self = this;

      this.i18n = viewParams.i18n;
      this.supportedPredicatesList = viewParams.data.supportedPredicatesList;
      this.policyCondition = viewParams.data.policyCondition;

      this.pages = ko.observableArray([viewParams.startPage]);

      this.chosenPredicate = ko.observable();

      this.argumentsValue = ko.observable(this.policyCondition.predicate['arguments'][0]);
      this.parameters = ko.observableArray([...this.policyCondition.predicate['arguments']]);
      this.parametersOptions = [];
      this.parametersValues = ko.observableArray();

      this.manageArgumentValues = {
        header: {
          title: ko.observable(''),
          instructions: ko.observable('')
        }
      };

      this.conditionPhrase = ko.observable();

      this.predicatesDataProvider = new ArrayDataProvider(
        this.supportedPredicatesList,
        { keyAttributes: 'value' }
      );

      this.editArgumentVal = ko.observable();

      this.parametersDataProvider = new ArrayDataProvider(
        this.parametersOptions,
        { keyAttributes: 'value' }
      );

      this.connected = function () {
        // Create an array from the values assigned to the
        // ['arguments'.value field.
        const values = this.policyCondition.predicate['arguments'].map(values => values.value);
        if (CoreUtils.isNotUndefinedNorNull(values[0]) && values[0] !=='') {
          this.parametersOptions = values.map(value => {
            // An option needs to have a value property, so
            // return a JS object with value assigned to that
            // property.
            return { value: value};
          });

          // Update the observable array used in the view, to
          // determine if oj-combobox-many or oj-input-text
          // controls need to be displayed.
          this.parametersValues(values);
        }

        if (values.length === 0 && viewParams.startPage === 'manage-argument-values') {
          updateChosenPredicateObservable();
          handleNoArgumentsPredicates(values);
        }

        if (viewParams.startPage === 'choose-predicate') {
          // This means that we're in an "addCondition" scenario.
          // We'll need to use an element-scoped busy context, to
          // force focus to go to our JET oj-select-single control.
          const element = document.getElementById('predicate');
          Context.getContext(element).getBusyContext().whenReady()
            .then(() => {
              element.focus();
            });
        }
        else if (viewParams.startPage === 'manage-argument-values') {
          // This means that we're in a "editConnection" scenario.
          // First, we call viewParams.getConditionPhrase to set
          // the expression property of policy condition we're
          // modifying.
          this.policyCondition.expression = viewParams.getConditionPhrase(self.policyCondition);
          // Next, use updated expression to set self.conditionPhrase
          // observable.
          this.conditionPhrase(this.policyCondition.expression);
          // Next, call updatePageHeaderObservables to set observables
          // used in page header.
          updatePageHeaderObservables(this.policyCondition.predicate);
          // Next, call updateParametersObservable to set observables
          // used to show placeholder/format requirement info.
          updateParametersObservable(this.policyCondition.predicate);
          // Lastly, use a page-scoped busy context to do things when
          // the page is actually visible.
          Context.getPageContext().getBusyContext().whenReady()
            .then(() => {
              const valueSelector = 'div.oj-combobox-selected-choice-label';
              const popupSelector = 'edit-argument-value-popup';
              // Assign "onclick" function to <oj-option> elements
              // of oj-combobox-many control.
              argumentsValueOnClick(valueSelector, popupSelector);
              // Lastly, call afterPredicateChosen with the selector
              // for the input portion of the oj-combobox-many control,
              // so the focus can be set to that input portion.
              if (this.policyCondition.predicate['arguments'].length > 0) {
                const inputSelector = `${this.policyCondition.predicate['arguments'][0].displayName}|input`;
                afterPredicateChosen(inputSelector);
              }
            });
        }
      }.bind(this);

      this.chosenPredicateValueChanged = (event) => {
        resetParametersValuesObservables();

        const chosen = getChosen();

        const predicate = {
          name: event.detail.value,
          arguments: chosen.arguments,
          descriptionHTML: chosen.descriptionHTML,
          displayName: chosen.label
        };

        viewParams.clearFailureMessage();

        viewParams.dispatchStepEvent({
          type: 'add-predicate-chosen',
          data: predicate
        });

        if (chosen.arguments.length === 0) {
          handleNoArgumentsPredicates(chosen.arguments);
          delete self.policyCondition.predicate['arguments'];
        }
        else {
          self.argumentsValue(chosen.arguments[0]);

          self.policyCondition.predicate.name = predicate.name;
          self.policyCondition.predicate.displayName = predicate.displayName;
          self.policyCondition.predicate.descriptionHTML = predicate.descriptionHTML;

          updatePageHeaderObservables(predicate);
          updateParametersObservable(predicate);

          updateNavigablePages('manage-argument-values');

          const onPredicateChosen = (inputSelector) => {
            afterPredicateChosen(inputSelector);
          };

          // Be mindful that predicate['arguments'][0].displayName
          // is an observable, because it is used for a label on
          // the page.
          setTimeout(onPredicateChosen.bind(this, `${predicate['arguments'][0].displayName}|input`), 5);
        }
      };

      this.parametersValuesChanged = (event) => {
        function updateParametersOptions(event) {
          if (event.detail.trigger === 'enter_pressed') {
            // This means the user pressed the Enter key
            // after entering a new arguments value. Use
            // event.detail.value.map to update the
            // self.paranetersOptions array, which are
            // the options for the oj-combobox-many.
            self.parametersOptions = event.detail.value.map((value) => {
              return { value: value};
            });
          }
          else if (event.detail.updatedFrom === 'external') {
            // This means the user edited an arguments value, sp
            // we need to remove it from self.parametersOptions.
            // We use event.detail.value to do that.
            const diff = CoreUtils.getDifference(event.detail.previousValue, event.detail.value);
            // diff is an array containing the arguments value
            // (i.e. string) that is in event.detail.previousValue
            // but not in event.detail.value. We need the index
            // of the diff item in self.parametersOptions, so we
            // can update it with the edited value.
            const index = self.parametersOptions.findIndex(option => option.value === diff[0]);
            if (index !== -1) {
              // We found it, so update the corresponding item
              // in self.parametersOptions.
              self.parametersOptions[index].value = event.detail.value[index];
              // Finally, update the data in the ArrayDataProvider
              // bound to the oj-combobox-many.
              self.parametersDataProvider.data = [...self.parametersOptions];
            }
          }
          else if (event.detail.updatedFrom !== 'external') {
            // event.detail.value will be undefined when the
            // user has deleted all the arguments values, which
            // is fine as long as the user isn't now picking a
            // previously deleted item from the dropdown. If
            // so, then we need to skip this code that manages
            // the self.parametersOptions array.
            if (event.detail.trigger !== 'option_selected') {
              // getDifference returns an array
              const diff = CoreUtils.getDifference(event.detail.previousValue, event.detail.value);
              if (diff) {
                const index = self.parametersOptions.findIndex(option => option.value === diff[0]);
                if (index === -1) self.parametersOptions.push({value: diff[0]});
              }
              self.parametersDataProvider.data = [...self.parametersOptions];
            }
          }
        }

        if (self.parameters().length === 0) {
          // This means the user deleted all the arguments
          // values in the oj-combobox-many. We cannot be
          // in a state where self.parameters is empty,
          // because the view (i.e. html file) uses the
          // self.parameters knockout observable array
          // in expressions. To keep JET happy, we assign
          // the first predicate['arguments'] array item
          // from self.policyCondition, to self.parameters.
          self.parameters([...self.policyCondition.predicate['arguments']]);
        }

        if (self.argumentsValue().array) {
          // The user deleted an arguments value, so the
          // self.parameters() observable is going to have
          // an item it should not have anymore. We handle
          // this by first creating a newParameters array
          // using event.detail.value.map.
          const newParameters = event.detail.value.map((value) => {
            // The map function runs a forEach under the
            // covers, so what we're returning here is a
            // JS object comprised of event.detail.value[i]
            // and the single item in self.argumentsValue().
            return {
              value: value,
              array: self.argumentsValue().array,
              displayName: self.argumentsValue().displayName,
              descriptionHTML: self.argumentsValue().descriptionHTML
            };
          });

          // Next, we overwrite self.parameters with the
          // newParameters array we just created. Thd
          // event.detail.value array didn't have the
          // deleted arguments value in it, so this
          // means it won't be in newParameters either,
          self.parameters.valueWillMutate();
          self.parameters(newParameters);
          self.parameters.valueHasMutated();

          // Display or clear required fields not completed
          // message
          if (self.parameters().length === 0 && event.detail.updatedFrom !== 'external') {
            viewParams.displayFailureMessage(viewParams.i18n.messages.requiredFieldsMissing.detail);
          }
          else {
            viewParams.clearFailureMessage();
          }
        }
        else {
          const filteredArgumentValues = self.parameters().filter(item => CoreUtils.isNotUndefinedNorNull(item.value) && item.value !== '' && item.optional === false);

          // Display or clear required fields not completed
          // message
          if (filteredArgumentValues.length === 0) {
            viewParams.displayFailureMessage(viewParams.i18n.messages.requiredFieldsMissing.detail);
          }
          else {
            viewParams.clearFailureMessage();
          }
        }

        // The user can remove all of the content from a field
        // (i.e. "clear it out"), so we need to filter out the
        // ones they do that to.
        const filteredArgumentValues = self.parameters().filter(item => CoreUtils.isNotUndefinedNorNull(item.value) && item.value !== '');

        // The CBE will accept just "GMT" as the value for the
        // "GMT Offset" field. When it does, the embedded LDAP
        // store the security policy data is stored in will get
        // corrupted, so we need to validate the value entered
        // in the "GMT Offset" field, here.
        const index = filteredArgumentValues.findIndex(argumentValue => argumentValue.type === 'GMTOffset');
        if (index !== -1) {
          const gmtOffsetArgument = filteredArgumentValues[index];
          if (CoreUtils.isNotUndefinedNorNull(gmtOffsetArgument.value) &&
              gmtOffsetArgument.value !== ''
          ) {
            const regex = /GMT[+-][0-9]{1,2}:[0-9]{2}\b/;
            if (regex.test(gmtOffsetArgument.value)) {
              viewParams.clearFailureMessage();
            }
            else {
              filteredArgumentValues.splice(index, 1);
              viewParams.displayFailureMessage(viewParams.i18n.messages.argumentValueHasWrongFormat.summary.replace('{0}', gmtOffsetArgument.displayName));
            }
          }
        }

        // Next, update the arguments array in the
        // self.policyCondition.predicate and send
        // it in a 'argument-values-changed' type
        // dispatchStepEvent call.
        self.policyCondition.predicate['arguments'] = [...filteredArgumentValues];

        if (self.policyCondition.predicate['arguments'].length === 0) {
          // The displayName is the first part of the value
          // assigned to the conditionPhrase observable, so
          // it will already be visible in the read-only
          // "Condition Phrase" field. We need to set the
          // expression property to '' here, in order to
          // clear the displayName from that field.
          self.policyCondition.expression = '';
        }
        else {
          self.policyCondition.expression = viewParams.getConditionPhrase(self.policyCondition);
        }

        self.conditionPhrase(self.policyCondition.expression);

        viewParams.dispatchStepEvent({
          type: 'argument-values-changed',
          data: upsertArgumentsProperties(self.policyCondition)
        });

        updateNavigablePages('manage-argument-values');

        if (self.argumentsValue().array) {
          updateParametersOptions(event);

          const onArgumentsValueClicked = (popupSelector) => {
            const valueSelector = 'div.oj-combobox-selected-choice-label';
            argumentsValueOnClick(valueSelector, popupSelector);
          };

          setTimeout(onArgumentsValueClicked.bind(this, 'edit-argument-value-popup'), 5);
        }
      };

      this.onPopupCancelBtnClicked = (event) => {
        event.preventDefault();
        const popup = document.getElementById('edit-argument-value-popup');
        popup.close();
      };

      function afterPredicateChosen(inputSelector){
        const ele = document.getElementById(inputSelector);
        if (ele !== null) ele.focus();
      }

      function argumentsValueOnClick(valueSelector, popupSelector) {
        function onKeyUpEnter(popup, oldValue, newValue) {
          const values = self.parametersValues();
          let index = values.indexOf(oldValue);
          if (index !== -1) {
            values[index] = newValue;
            self.parametersValues.valueWillMutate();
            self.parametersValues(values);
            self.parametersValues.valueHasMutated();
          }
          popup.onkeyup = null;
          popup.close();
        }

        function onKeyUpEsc(popup) {
          popup.onkeyup = null;
          popup.close();
        }

        const nodeList = document.querySelectorAll(valueSelector);

        if (nodeList !== null) {
          nodeList.forEach((node) => {
            node.classList.add('cfe-arguments-value');
            node.onclick = (event) => {
              const textContent = event.currentTarget.textContent;
              self.editArgumentVal(textContent);
              const popup = document.getElementById(popupSelector);
              popup.onkeyup = (event) => {
                switch (event.key) {
                  case 'Enter':
                    onKeyUpEnter(popup, textContent, self.editArgumentVal());
                    // Suppress default handling of keyup event
                    event.preventDefault();
                    // Veto the keyup event, so JET will update the knockout
                    // observable associated with the <oj-input-text> element
                    return false;
                  case 'Escape':
                    // Treat pressing the "Escape" key as clicking the "Cancel" button
                    onKeyUpEsc(popup);
                    break;
                }
              };
              popup.open(`#${event.currentTarget.id}`, {
                'at': {
                  'horizontal': 'end',
                  'vertical': 'top'
                },
                'my': {
                  'horizontal': 'start',
                  'vertical': 'bottom'
                }
              });

              const onPopupOpened = (inputSelector) => {
                const ele = document.getElementById(inputSelector);
                if (ele !== null) ele.focus();
              };

              setTimeout(onPopupOpened.bind(this, 'edit-arguments-value-input'), 5);
            };
          });
        }
      }

      function hasPredicateArguments(predicate) {
        return (
          CoreUtils.isNotUndefinedNorNull(predicate['arguments']) &&
          predicate['arguments'].length > 0 &&
          predicate['arguments'][0].array);
      }

      function updatePageHeaderObservables(predicate) {
        self.manageArgumentValues.header.title(predicate.displayName);
        self.manageArgumentValues.header.instructions(predicate.descriptionHTML);

        if (hasPredicateArguments(predicate)) {
          const descriptionHTML = self.i18n.wizard.pages.manageArgumentValues.header.instructions().replace('<i></i>', `<i>${predicate['arguments'][0].displayName}</i>`);
          self.manageArgumentValues.header.instructions(descriptionHTML);
        }
      }

      function updateChosenPredicateObservable() {
        self.pages.valueWillMutate();
        self.pages.splice(0, 0, 'choose-predicate');
        self.pages.valueHasMutated();
        self.chosenPredicate(self.policyCondition.predicate.name);
      }

      function handleNoArgumentsPredicates(argumentValues = []) {
        const index = self.pages().indexOf('manage-argument-values');
        if (index !== -1) {
          // You must use the valueWillMutate and
          // valueHasMutated functions here, or
          // the dialog box will not visually expand
          // and collapse correctly!!
          self.pages.valueWillMutate();
          self.pages().splice(index,1);
          self.pages.valueHasMutated();
        }
        const ele = document.getElementById('predicate');
        if (ele !== null) {
          ele.setAttribute('disabled', (argumentValues.length === 0));
        }
      }

      function upsertArgumentsProperties(policyCondition) {
        if (CoreUtils.isNotUndefinedNorNull(policyCondition.predicate['arguments']) &&
            (policyCondition.predicate['arguments'].length > 0)
        ) {
          const predicate = self.supportedPredicatesList.find(item => item.value === policyCondition.predicate.name);
          for (const i in policyCondition.predicate['arguments']) {
            const index = predicate['arguments'].findIndex(item => item.displayName === policyCondition.predicate['arguments'][i].displayName);
            if (index !== -1) policyCondition.predicate['arguments'][i]['optional'] = predicate['arguments'][index].optional;
          }
        }
        return policyCondition;
      }


      function getChosen() {
        // item.value is predicate.name in the following line of code
        const chosen = self.supportedPredicatesList.find(item => item.value === event.detail.value);

        // The arguments array in supportedPredicatesList is not going
        // to have a "value" field. This means that for an "AddCondition",
        // we'll need to add a one to each of the chosen['arguments']
        // items. Just assign null, don't make it an observable.
        for (const i in chosen['arguments']) {
          chosen['arguments'][i]['value'] = null;
        }
        return chosen;
      }

      function resetParametersValuesObservables() {
        self.parametersValues.valueWillMutate();
        self.parametersValues([]);
        self.parametersValues.valueHasMutated();

        self.parametersOptions = [];
      }

      /**
       * Needs to be called during an ``AddCondition`` and ` EditCondition`` editor action, so don't make this a closure function.
       * @private
       */
      function updateParametersObservable(predicate) {
        // Tell knockout that we're changing the observable.
        self.parameters.valueWillMutate();
        // The self.parameters observable is initialized with
        // a single placeholder array item. The predicate may
        // have more than just field, so we need to first use
        // predicate['arguments'] to size it correctly.
        self.parameters(predicate['arguments']);
        // Loop through predicate['arguments'] and update the
        // corresponding self.parameters items.
        for (const i in predicate['arguments']) {
          self.parameters()[i]['value'] = predicate['arguments'][i].value;
          self.parameters()[i].displayName = predicate['arguments'][i].displayName;
          self.parameters()[i].descriptionHTML = predicate['arguments'][i].descriptionHTML;
          self.parameters()[i]['optional'] = predicate['arguments'][i].optional || false;
          self.parameters()[i]['type'] = predicate['arguments'][i].type || 'string';
          self.parameters()[i]['placeholder'] = predicate['arguments'][i].placeholder;
        }
        // Tell knockout that we're finished changing the observable.
        self.parameters.valueHasMutated();
      }

      function updateNavigablePages(pageId) {
        if (self.pages().indexOf(pageId) === -1) {
          self.pages.valueWillMutate();
          self.pages().push(pageId);
          self.pages.valueHasMutated();
        }
      }

    }

    return PolicyEditorWizardPage;
  }
);