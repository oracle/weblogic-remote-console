/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/wdt-model/archive', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojlogger'],
  function (oj, ko, ArrayDataProvider, DataProviderManager, ModelArchive, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Logger) {

    const i18n = {
      'messages': {
        'changesSaved': {'summary': oj.Translations.getTranslatedString('wrc-wdt-form.messages.changesSaved.summary', '{0}')},
        'changesNotSaved': {'summary': oj.Translations.getTranslatedString('wrc-wdt-form.messages.changesNotSaved.summary', '{0}')},
        'changesDownloaded': {'summary': oj.Translations.getTranslatedString('wrc-wdt-form.messages.changesDownloaded.summary', '{0}')},
        'changesNotDownloaded': {'summary': oj.Translations.getTranslatedString('wrc-wdt-form.messages.changesNotDownloaded.summary', '{0}')}
      },
      'wdtOptionsDialog': {
        'instructions': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.instructions'),
        'default': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.default'),
        'enterValue': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.enterValue'),
        'selectValue': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.selectValue'),
        'selectSwitch': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.selectSwitch'),
        'enterUnresolvedReference': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.enterUnresolvedReference'),
        'enterModelToken': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.enterModelToken'),
        'selectPropsVariable': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.selectPropsVariable'),
        'createPropsVariable': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.createPropsVariable'),
        'propName': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.propName'),
        'propValue': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.propValue'),
        'enterVariable': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.enterVariable'),
        'variableName': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.variableName'),
        'variableValue': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.variableValue'),
        'multiSelectUnset': oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.multiSelectUnset')
      }
    };

    /**
     *
     * @param viewParams
     * @constructor
     */
    function WdtForm(viewParams) {
      var _fields = {};
      this.viewParams = viewParams;
      this.pdjData = viewParams.parentRouter.data.pdjData();
      this.rdjData = viewParams.parentRouter.data.rdjData();
      this.pdjTypes = null;
      this.getWDTOptionsFields = function () { return _fields; };
    }

    /**
     *
     * @param {DialogFields} dialogFields
     * @returns {{title: string, html: string, fields: *}}
     * @private
     */
    function createWDTOptionsDialogDOMFragment(dialogFields) {
      const title = oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.title', '{0}');
      const result = {title: title.replace('{0}', dialogFields.nameLabel)};

      const displayClass = dialogFields.displayClass;
      let inputLabel = i18n.wdtOptionsDialog.enterValue;
      if(displayClass === 'oj-select-single' || displayClass === 'oj-combobox-one'){
        inputLabel = i18n.wdtOptionsDialog.selectValue;
      }
      if(displayClass === 'oj-switch'){
        inputLabel = i18n.wdtOptionsDialog.selectSwitch;
      }

      const radioEnter = '[[buttonSelected() === \'fromRegValue\' ]]';
      const radioModelToken = '[[buttonSelected() === \'fromModelToken\']]';
      const radioRef = '[[buttonSelected() === \'fromUnresolvedReference\' ]]';
      const radioPropOptions = '[[buttonSelected() === \'fromPropOptions\' ]]';
      const radioPropCreate = '[[buttonSelected() === \'createPropOptions\' ]]';
      const radioSelectVariable = '[[buttonSelected() === \'fromSelectWKTVariable\' ]]';
      const radioVariable = '[[buttonSelected() === \'fromWKTVariable\' ]]';

      let dialogDom = '<br/>';
      dialogDom += '<oj-radioset id=\'radio_' + dialogFields.id + '\' value=\'{{buttonSelected}}\' ';
      dialogDom += (dialogFields.disabled) ? 'disabled=true>' : '>';
      if ( (CoreUtils.isUndefinedOrNull(dialogFields.valueSet)) || (dialogFields.valueSet === true)) {
        dialogDom += '<oj-option value=\'restoreToDefault\'>' + i18n.wdtOptionsDialog.default + '</oj-option>';
      }

      dialogDom += '<oj-option value=\'fromRegValue\'>' + inputLabel + '</oj-option>';
      dialogDom += '<oj-bind-if test="' + radioEnter +'">';

      const addDisable =  (dialogFields.disabled) ? ' disabled=true ' : '';
      switch(displayClass) {
        case 'oj-select-single':
        case 'oj-combobox-one':
          dialogDom += '      <div> <oj-select-single id=\'select_' + dialogFields.id + '\'';
          dialogDom += '      class=\'cfe-selected cfe-form-input-single-column\' ';
          dialogDom += '      data=\'[[fieldSelectData_' + dialogFields.dataId +']]\'';
          dialogDom += addDisable;
          dialogDom += '      value=\'{{dialogFields().selectedValue}}\'></oj-select-single> </div>';
          break;
        case 'oj-switch':
          dialogDom += '      <div><oj-switch id=\'switch_' + dialogFields.id + '\'';
          dialogDom += addDisable;
          dialogDom += '      value=\'{{dialogFields().itemValue}}\'></oj-switch> </div>';
          break;
        case 'oj-input-text':
          dialogDom += '      <div><oj-input-text id=\'text_' + dialogFields.id + '\'';
          dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
          dialogDom += addDisable;
          dialogDom += '      value=\'{{dialogFields().itemValue}}\' ></oj-input-text></div>';
          break;
        case 'oj-text-area':
          dialogDom += '      <div><oj-text-area id=\'textarea_' + dialogFields.id + '\'';
          dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
          dialogDom += addDisable;
          dialogDom += '      value=\'{{dialogFields().itemValue}}\' ></oj-text-area></div>';
          break;
        case 'oj-input-password':
          dialogDom += '      <div><oj-input-password id=\'text_' + dialogFields.id + '\'';
          dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
          dialogDom += '      mask-icon=\'visible\' ';
          dialogDom += addDisable;
          dialogDom += '      value=\'{{dialogFields().itemValue}}\' ></oj-input-password></div>';
          break;
      }
      dialogDom += '</oj-bind-if>';

      if (dialogFields.supportsModelTokens === 'true' && dialogFields.wktTool === 'false'){
        dialogDom += '<oj-option value=\'fromModelToken\'>' +i18n.wdtOptionsDialog.enterModelToken +'</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioModelToken + '">';
        dialogDom += '    <div><oj-input-text id=\'text_' + dialogFields.id + '\'';
        dialogDom += '    placeholder=\'@@PROP:KEY@@\'';
        dialogDom += addDisable;
        dialogDom += '    class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += '    value=\'{{dialogFields().variableName}}\' ></oj-input-text></div>';
        dialogDom += '</oj-bind-if>';
      }
      if (dialogFields.supportsUnresolvedReferences === 'true'){
        dialogDom += '<oj-option value=\'fromUnresolvedReference\'>' +i18n.wdtOptionsDialog.enterUnresolvedReference +'</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioRef + '">';
        dialogDom += '    <div><oj-input-text id=\'text_' + dialogFields.id + '\'';
        dialogDom += '    class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += addDisable;
        dialogDom += '    value=\'{{dialogFields().unresolvedValue}}\' ></oj-input-text></div>';
        dialogDom += '</oj-bind-if>';
      }
      if (dialogFields.wktTool === 'true' && dialogFields.supportsModelTokens === 'true'){
        //Add the wkt variable list drop down to allow user to choose from.
        dialogDom += '<oj-option value=\'fromSelectWKTVariable\'>' + i18n.wdtOptionsDialog.selectPropsVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioSelectVariable + '">';
        dialogDom += '      <div> <oj-select-single id=\'variableSelect_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += '      data=\'[[dialogFields().pageWKTVariables]]\'  ';
        dialogDom += '      value=\'{{dialogFields().variableUid}}\'  ' ;
        dialogDom += '      on-oj-value-action=\'[[dialogFields().onValueUpdatedSelectWKTVariable]]\' > ';
        dialogDom += '       </oj-select-single> </div>';
        dialogDom += '</oj-bind-if>';

        //Allow user to create or change value of a variable
        dialogDom += '<oj-option value=\'fromWKTVariable\'>' + i18n.wdtOptionsDialog.enterVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioVariable + '">';
        dialogDom += '      <div><oj-input-text id=\'varname_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.variableName + '\' ';
        dialogDom += '      value=\'{{dialogFields().variableName}}\' ;></oj-input-text></div>';

        dialogDom += '      <div><oj-input-text id=\'varvalue_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.variableValue + '\' ';
        dialogDom += '      value=\'{{dialogFields().itemValue}}\' ></oj-input-text></div>';
        dialogDom += '</oj-bind-if>';
        }

      //If properties is available,
      //we will add the variable list drop down to allow user to choose from.
      if (dialogFields.supportsPropSelect === true && dialogFields.supportsModelTokens === 'true') {
        dialogDom += '<oj-option value=\'fromPropOptions\'>' + i18n.wdtOptionsDialog.selectPropsVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioPropOptions + '">';
        dialogDom += '      <div> <oj-select-single id=\'propSelect_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += '      data=\'[[dialogFields().pagePropVariables]]\'  ';
        dialogDom += '      value=\'{{dialogFields().variableName}}\'></oj-select-single> </div>';
        dialogDom += '</oj-bind-if>';
      }

      //If properties can be created,
      //we will provide the name and value field for user to add a property.
      if (dialogFields.supportsPropCreate === true && dialogFields.supportsModelTokens === 'true') {
        dialogDom += '<oj-option value=\'createPropOptions\'>' + i18n.wdtOptionsDialog.createPropsVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioPropCreate + '">';
        dialogDom += '      <div><oj-input-text id=\'textarea_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.propName + '\' ';
        dialogDom += '      value=\'{{dialogFields().newPropName}}\' ;></oj-text-area></div>';
        dialogDom += '      <div><oj-input-text id=\'textarea_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.propValue + '\' ';
        dialogDom += '      value=\'{{dialogFields().newPropValue}}\' ></oj-text-area></div>';
        dialogDom += '</oj-bind-if>';
      }

      dialogDom += '</oj-radioset>';
      dialogDom += '<br><br>';

      //console.log(`[WDTFORM] dialogDom=${dialogDom}`);
      result['html'] = dialogDom;
      result['fields'] = dialogFields;

      return result;
    }

    /**
     *
     * @param {DialogFields} dialogFields
     * @returns {{title: string, html: string, fields: *}}
     * @private
     */
    function createWDTOptionsDialogDOMFragmentMultiSelect(dialogFields) {
      const title = oj.Translations.getTranslatedString('wrc-wdt-form.wdtOptionsDialog.title', '{0}');
      const result = {title: title.replace('{0}', dialogFields.nameLabel)};

      const displayClass = dialogFields.displayClass;
      let inputLabel = i18n.wdtOptionsDialog.enterValue;

      const radioModelToken = '[[buttonSelected() === \'fromModelToken\']]';
      const radioPropOptions = '[[buttonSelected() === \'fromPropOptions\' ]]';
      const radioPropCreate = '[[buttonSelected() === \'createPropOptions\' ]]';
      const radioSelectVariable = '[[buttonSelected() === \'fromSelectWKTVariable\' ]]';
      const radioVariable = '[[buttonSelected() === \'fromWKTVariable\' ]]';

      let dialogDom = '<br/>';
      dialogDom += '<oj-radioset id=\'radio_' + dialogFields.id + '\' value=\'{{buttonSelected}}\' ';
      dialogDom += (dialogFields.disabled) ? 'disabled=true>' : '>';

      dialogDom += '<oj-option value=\'fromRegValue\'>' + i18n.wdtOptionsDialog.multiSelectUnset + '</oj-option>';

      if (dialogFields.wktTool === 'true' && dialogFields.supportsModelTokens === 'true'){

        //Add the wkt variable list drop down to allow user to choose from.
        dialogDom += '<oj-option value=\'fromSelectWKTVariable\'>' + i18n.wdtOptionsDialog.selectPropsVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioSelectVariable + '">';
        dialogDom += '      <div> <oj-select-single id=\'variableSelect_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-required-field cfe-form-input-single-column\' ';
        dialogDom += '      data=\'[[dialogFields().pageWKTVariables]]\'  ';
        dialogDom += '      value=\'{{dialogFields().variableUid}}\'></oj-select-single> </div>';
        dialogDom += '</oj-bind-if>';

        dialogDom += '<oj-option value=\'fromWKTVariable\'>' + i18n.wdtOptionsDialog.enterVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioVariable + '">';
        dialogDom += '      <div><oj-input-text id=\'varname_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-required-field  cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.variableName + '\' ';
        dialogDom += '      value=\'{{dialogFields().variableName}}\' ;></oj-text-area></div>';

        dialogDom += '      <div><oj-input-text id=\'varvalue_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.variableValue + '\' ';
        dialogDom += '      value=\'{{dialogFields().itemValue}}\' ></oj-text-area></div>';
        dialogDom += '</oj-bind-if>';
      } else {
        dialogDom += '<oj-option value=\'fromModelToken\'>' + i18n.wdtOptionsDialog.enterModelToken +'</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioModelToken + '">';
        dialogDom += '    <div><oj-input-text id=\'text_' + dialogFields.id + '\'';
        dialogDom += '    class=\'cfe-form-input-single-column\' ';
        dialogDom += '    placeholder=\'@@PROP:KEY@@\'';
        dialogDom += '    value=\'{{dialogFields().variableName}}\' ></oj-input-text></div>';
        dialogDom += '</oj-bind-if>';
      }

      //If model token is supported and the page rdj has modelTokens
      //we will add the variable list drop down to allow user to choose
      //and provide the name and value field for user to add a property.
      if (dialogFields.supportsPropSelect === true && dialogFields.supportsModelTokens === 'true') {
        dialogDom += '<oj-option value=\'fromPropOptions\'>' + i18n.wdtOptionsDialog.selectPropsVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioPropOptions + '">';
        dialogDom += '      <div> <oj-select-single id=\'propSelect_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-form-input-single-column\' ';
        dialogDom += '      data=\'[[dialogFields().pagePropVariables]]\'  ';

        dialogDom += '      value=\'{{dialogFields().variableName}}\'></oj-select-single> </div>';
        dialogDom += '</oj-bind-if>';
      }

      if (dialogFields.supportsPropCreate === true && dialogFields.supportsModelTokens === 'true') {
        dialogDom += '<oj-option value=\'createPropOptions\'>' + i18n.wdtOptionsDialog.createPropsVariable + '</oj-option>';
        dialogDom += '<oj-bind-if test="' + radioPropCreate + '">';
        dialogDom += '      <div><oj-input-text id=\'textarea_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.propName + '\' ';
        dialogDom += '      value=\'{{dialogFields().newPropName}}\' ;></oj-text-area></div>';

        dialogDom += '      <div><oj-input-text id=\'textarea_' + dialogFields.id + '\'';
        dialogDom += '      class=\'cfe-form-input-single-column\' ';
        dialogDom += '      label-hint=\' ' + i18n.wdtOptionsDialog.propValue + '\' ';
        dialogDom += '      value=\'{{dialogFields().newPropValue}}\' ></oj-text-area></div>';
        dialogDom += '</oj-bind-if>';
      }

      dialogDom += '</oj-radioset>';
      dialogDom += '<br><br>';
      console.log(`[WDTFORM] dialogDom=${dialogDom}`);
      result['html'] = dialogDom;
      result['fields'] = dialogFields;
      return result;
    }

    function displayWDTOptionsDialog(dialog, ignoreReturn) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('click', okClickHandler);
          cancelBtn.removeEventListener('click', cancelClickHandler);
          dialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }
        function onEnterKey() {
          const ojInputs = dialog.querySelectorAll('.cfe-required-field');
          const ojInputsArray = Array.from(ojInputs);
          const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => (ojInput.value !== null && ojInput.value !== ''));
          return (ojInputs.length !== ojInputsArrayFiltered.length);
        }
        function okClickHandler(event) {
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          dialog.close();
        }
        function cancelClickHandler() {
          onClose(false);
          dialog.close();
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
        const okBtn = document.getElementById('dlgOkBtn22');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn22');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        dialog.addEventListener('keyup', onKeyUp);
      });
    }

    function dispatchElectronApiSignal(channel, data) {
      return window.electron_api.ipc.invoke(channel, data);
    }

    function downloadDataProviderContentFile(dataProvider) {
      switch (dataProvider.type) {
        case 'model':
          return DataProviderManager.downloadWDTModel(dataProvider);
        case 'properties':
          return DataProviderManager.downloadPropertyList(dataProvider);
      }
    }
    /**
     *
     * @param {DialogFields} dialogFields
     * @returns {{title: string, html: string, fields: {DialogFields}}}
     * @private
     */
    function getWDTOptionsDialogDOMFragment(dialogFields) {
      if (dialogFields.displayClass === 'cfe-multi-select') {
        return createWDTOptionsDialogDOMFragmentMultiSelect(dialogFields);
      }
      else {
        return createWDTOptionsDialogDOMFragment(dialogFields);
      }
    }

    function getNextUID(properties) {
      let uid = -1;
      properties.forEach((property) => {
        if (property.uid > uid) uid = property.uid;
      });
      return ++uid;
    }

    /**
     * Nested class for setting and capturing the value of fields, used in a dialog box.
     * @returns {{addField: addField, putValue: putValue}}
     * @constructor
     */
    function DialogFields() {
      return {
        addField: function(name, value) {
          if (typeof value === 'number') value = value.toString();
          this.putValue(name, value || '');
        },
        putValue: function(name, value) {
          this[name] = value;
        }
      }
    }

    function getModelPropertyNameArray(){
      let optionsArray = [];
      const dataProvider = this.getDataProvider();
      if (dataProvider && dataProvider.modelProperties) {
        dataProvider.modelProperties.forEach((property) => {
          //if (! CoreUtils.isEmpty(property.Value)) {
          optionsArray.push({value: property.uid, label: property.Name});
          //}
        });
      }
      return new ArrayDataProvider(optionsArray, { keyAttributes: 'value' });
    }

    //public:
    WdtForm.prototype = {
      /**
       * Returns a reference to the ``DataProvider`` instance associated with this instance of the ``WdtForm`` class.
       * Note, if the optional ``DataProvider`` id  parameter is supplied, that provider instance will be returned.
       * @param {string} dataProviderId
       * @returns {undefined|DataProvider}
       */
      getDataProvider: function(dataProviderId = null) {
        const providerId = CoreUtils.isNotUndefinedNorNull(dataProviderId) ? dataProviderId : this.viewParams.beanTree.provider.id;
        return DataProviderManager.getDataProviderById(providerId);
      },
      /**
       * Returns a Promise containing an object with information and data, which relates to the changes the CBE has for a the content file.
       * <p>If the ``window.electron_api`` is available, the returned information and data are used to write to the actual content file.
       * Otherwise, the caller can use the returned information and data to subsequently call ``writeContentFile``.</p>
       * @param {string} dataProviderId
       * @returns {Promise<{succeeded: boolean, filepath: string, fileContents: string}>}
       */
      getContentFileChanges: function(dataProviderId = null) {
        const dataProvider = this.getDataProvider(dataProviderId);
        if (CoreUtils.isUndefinedOrNull(dataProvider)) {
          return Promise.resolve({succeeded: false});
        }
        return downloadDataProviderContentFile(dataProvider)
          .then(reply => {
            if (ViewModelUtils.isElectronApiAvailable()) {
              // We're running as an Electron app, so use the
              // window.electron_api to write the model changes
              // retrieved from the CBE, to the actual model file.
              return dispatchElectronApiSignal('file-writing', {filepath: dataProvider.file, fileContents: reply.body.data});
            }
            else {
              // We're not running as an Electron app, so just
              // return Promise fulfillment containing false
              // (to indicate that the model changes retrieved
              // from the CBE we're written to a file), filepath
              // and fileContents. The caller will be able to
              // use these to subsequently call writeContentFile().
              return Promise.resolve({succeeded: false, filepath: dataProvider.file, fileContents: reply.body.data});
            }
          });
      },
      /**
       *
       * @param {{filepath: string, fileContents: string}} options
       * @param {string} dataProviderId
       * @returns {Promise<{succeeded: boolean}>}
       */
      writeContentFile: function (options, dataProviderId = null) {
        const dataProvider = this.getDataProvider(dataProviderId);
        if (CoreUtils.isUndefinedOrNull(dataProvider)) {
          return Promise.resolve({succeeded: false});
        }
        const mediaTypeSwitch = (value) => ({
          'model': 'application/x-yaml',
          'properties': 'text/plain'
        })[value];
        options['mediaType'] = mediaTypeSwitch(dataProvider.type);
        ViewModelUtils.downloadFile(options);
        return Promise.resolve({succeeded: true});
      },

      /**
       * When user enters/change a value in the field from the form directly,
       * determine where that value is from, to bring up the WDT Dialog.
       * @param {string} name - property name of the field
       * @param {string} fieldValue - new value entered
       * @returns {"fromRegValue"|"fromModelToken"|"fromUnresolvedReference"}
       */
      calValueFrom: function(name, fieldValue) {
        if (['boolean', 'object'].includes(typeof fieldValue)){
          return 'fromRegValue';
        }
        //if the field has legalValue, even if the input doesn't start with @@, we show as from Model Token so
        //user can change it, since in this case, there is only dropdown and model token in the dialog.
        if (typeof fieldValue === 'string'){
          if (fieldValue.startsWith('@@PROP:') && fieldValue.endsWith('@@')) {
            return 'fromModelToken';
          }
          if (this.pdjTypes.hasLegalValues(name)) {
            const oneVal = this.pdjTypes.getLegalValues(name).find(legalValue => legalValue.value === fieldValue);
            if (CoreUtils.isUndefinedOrNull(oneVal)) {
              return 'fromModelToken';
            }
          }
          if (this.pdjTypes.isDynamicEnumType(name) && typeof fieldValue === 'string' && fieldValue !== ''){
            return 'fromUnresolvedReference';
          }
        }
        return 'fromRegValue';
      },
      /**
       * Returns translated string of summary line, for message with a given``messageKey``.
       * @param {string} messageKey - The key associated with the summary line.
       * @returns {string}
       * @example
       * const summary = self.wdtForm.getSummaryMessage("changesWritten");
       */
      getSummaryMessage: function(messageKey, dataProviderId = null) {
        const dataProvider = this.getDataProvider(dataProviderId);
        return i18n.messages[messageKey].summary.replace('{0}', dataProvider['file']);
      },
      /*
       * @param {fieldName} fieldName - changed field name.
       * @param {fieldValue} fieldValue - new value.
       * @returns {{title: string, html: string, fields: {DialogFields}}}
       */

      formFieldValueChanged: function (fieldName, fieldValue, pageProp) {
        let iconLink = document.getElementById('wdtOptions_' + fieldName);
        let targetInfo = {
          iconLink: iconLink,
          curValue: fieldValue,
          valueFrom: this.calValueFrom(fieldName, fieldValue),
          valueSet: true,
          supportsPropSelect: pageProp.supportsPropSelect,
          supportsPropCreate: pageProp.supportsPropCreate,
          pagePropVariables: pageProp.pagePropVariables,
          pageWKTVariables: getModelPropertyNameArray.call(this)
        };
        return this.createWdtOptionsDialog(targetInfo) ;
      },

      getModelPropertyBasedOnUid: function(uid){
        let oneProperty = null;
        const dataProvider = this.getDataProvider();
        if ( uid >= 0 && dataProvider && dataProvider.modelProperties) {
          oneProperty = dataProvider.modelProperties.find(oneProp => oneProp.uid === uid);
        }
        return oneProperty;
      },
      getModelPropertyBasedOnName: function(name){
        let oneProperty = null;
        const dataProvider = this.getDataProvider();
        if (dataProvider && dataProvider.modelProperties) {
          oneProperty = dataProvider.modelProperties.find(oneProp => oneProp.Name === name);
        }
        return oneProperty;
      },
      getModelPropertyValue: function(propertyName) {
        let rtnval;
        if (CoreUtils.isEmpty(propertyName)) {
          return rtnval;
        }
        const dataProvider = this.getDataProvider();
        if (dataProvider && dataProvider.modelProperties) {
          const index = dataProvider.modelProperties.map(property => property.Name).indexOf(propertyName);
          if (index !== -1) {
            rtnval = dataProvider.modelProperties[index].Value;
          }
        }
        return rtnval;
      },
      setModelPropertyValue: function(propertyName, propertyValue) {
        const dataProvider = this.getDataProvider();
        if (dataProvider && dataProvider.modelProperties) {
          const index = dataProvider.modelProperties.map(property => property.Name).indexOf(propertyName);
          if (index !== -1) {
            if (CoreUtils.isNotUndefinedNorNull(propertyValue))
                dataProvider.modelProperties[index].Value = propertyValue;
          } else {
            this.addModelProperty(propertyName, propertyValue);
          }
        }
      },
      addModelProperty: function(propertyName, propertyValue ='') {
        const dataProvider = this.getDataProvider();
        if (dataProvider && dataProvider.modelProperties) {
          const index = dataProvider.modelProperties.map(property => property.Name).indexOf(propertyName);
          if (index === -1) {
            const property = {
              uid: getNextUID(dataProvider.modelProperties),
              Name: propertyName,
              Value: propertyValue,
              Override: undefined
            };
            dataProvider.modelProperties.push(property);
          }
        }
      },
      removeModelProperty: function(propertyName) {
        if (CoreUtils.isNotUndefinedNorNull(propertyName)) {
          const dataProvider = this.getDataProvider();
          if (dataProvider && dataProvider.modelProperties) {
            const index = dataProvider.modelProperties.map(property => property.Name).indexOf(propertyName);
            if (index !== -1) {
              dataProvider.modelProperties.splice(index, 1);
            }
          }
        }
      },


      updateModelProperty: function(dialogFields){
        //update to the new property
        const newVarName = dialogFields.variableName;
        this.setModelPropertyValue(newVarName, dialogFields.itemValue);

        //remove the old property if there is one.
        // let originalValue = dialogFields.originalValue;
        // if (typeof originalValue === 'string'){
        //   const foundMatch = originalValue.match(/@@PROP:(.+)@@/);
        //   if (CoreUtils.isNotUndefinedNorNull(foundMatch)) {
        //     originalValue = foundMatch[1];
        //   }
        //   if ((dialogFields.originalValueFrom === 'fromModelToken') && (newVarName !== originalValue)) {
        //     this.removeModelProperty(originalValue);
        //   }
        // }
      },
      /**
       * strips out the @@ sign, convert the @@PROP:NAME@@  to just NAME.
       * @param {tokenName}     the name that begins with @@PROP: and ends with @@
       * @returns {tokenName}   the stripped out name.  If the name doesn't starts with @@PROP: nor ends with @@, the oiginal
       *                        passed in name will be returned.
       */
      stripOutSign: function(tokenName){
        if (CoreUtils.isNotUndefinedNorNull(tokenName) && (typeof tokenName === 'string')) {
          const foundMatch = tokenName.match(/@@PROP:(.+)@@/);
          if (CoreUtils.isNotUndefinedNorNull(foundMatch)) {
            return foundMatch[1];
          }
        }
        return tokenName;
      },
      updateTokenValueSelection: function(event){
        const tokenNameId = event.currentTarget.attributes['id'].value;
        const tokenValueId = tokenNameId.replace('textarea_', 'varvalue_');
        const tokenValue = this.getModelPropertyValue(event.detail.value);
        if (CoreUtils.isNotUndefinedNorNull(tokenValue)){
          document.getElementById(tokenValueId).value = tokenValue;
        }
      },
      /**
       *
       * @param {DialogFields} dialogFields - Values that were captured using the controls in the ``wdtOptionsDialog`` dialog box.
       * @returns {DialogFields}
       */
      processWDTOptionsDialogFields: function(dialogFields) {
        // Get reference to _fields private instance variable.
        const fields = this.getWDTOptionsFields();
        // Update the _fields entry associated with the
        // dialogFields.id key.
        fields[dialogFields.id] = dialogFields;
        // Return dialogFields that was passed as the parameter
        // to this function. It may or may not have been altered
        // by code in this function.
        return dialogFields;
      },
      /**
       * Displays the ``wdtOptionsDialog`` dialog box.
       * @returns {Promise<{boolean}>} - Promise fulfillment containing boolean that indicates whether "OK" (true) or "Cancel" (false) action caused the closing of the ``wdtOptionsDialog`` dialog box.
       */
      showWdtOptionsDialog: async function(fromFieldChange, ignoreReturn) {
        const dialog = document.getElementById('wdtOptionsDialog');
        dialog.setAttribute('fromFieldChange', fromFieldChange);
        dialog.open();
        return displayWDTOptionsDialog(dialog, ignoreReturn)
          .then(result => {
            const ojInputs = dialog.querySelectorAll('.cfe-selected');
            const ojInputsArray = Array.from(ojInputs);
            if (ojInputsArray.length > 0 ){
              const valObj = ojInputs[0].value;
              const dataArray = ojInputs[0].data.data;
              let isLegal = false;
              const compValue = (typeof valObj === 'string') ? valObj : (valObj !== null ? valObj.label : null);
              dataArray.forEach((oneItem) => {
                if (oneItem.label ===  compValue) isLegal = true;
              });
              if (!isLegal)
                ojInputs[0].value = ojInputs[0].data.data[0].value;
            }
            return result;
          });
      },

      setupVariableDialogFields: function(dialogFields, currentValue, doElse=true) {
        const foundMatch = currentValue.match(/@@PROP:(.+)@@/);
        if (CoreUtils.isNotUndefinedNorNull(foundMatch)) {
          dialogFields.putValue('variableName', foundMatch[1]);
          const prop =  this.getModelPropertyBasedOnName(foundMatch[1]);
          if (CoreUtils.isNotUndefinedNorNull(prop)) {
            dialogFields.putValue('variableUid', prop.uid);
            dialogFields.putValue('itemValue', prop.Value);
          }else{
            dialogFields.putValue('itemValue', '');
          }
          dialogFields.putValue('showButtonSelected', 'fromWKTVariable');
        } else {
          if (doElse) {
            dialogFields.putValue('variableName', '');
            dialogFields.putValue('itemValue', currentValue);
            dialogFields.putValue('showButtonSelected', 'fromRegValue');
          }
        }
      },

      setupPropertiesDialogFields: function(dialogFields, currentValue){
        let found = false;
        if (CoreUtils.isNotUndefinedNorNull(dialogFields.pagePropVariables)) {
          const options = dialogFields.pagePropVariables.data;
          if (CoreUtils.isNotUndefinedNorNull(options)) {
            options.forEach((oneItem) => {
              if (oneItem.value === currentValue) {
                found = true;
              }
            });
          }
        }
        dialogFields.putValue('variableName', currentValue);
        dialogFields.putValue('showButtonSelected', found ? 'fromPropOptions' : 'fromModelToken');
      },

      /**
       * @param {object}  targetInfo - includes the link of the wdt icon, the current value on screen and if SetDefaultOption should be included.
       * @returns {{title: string, html: string, fields: {DialogFields}}}
       */
      createWdtOptionsDialog: function (targetInfo) {
        const iconLink = targetInfo.iconLink;
        const curValue = targetInfo.curValue;
        const valueFrom = targetInfo.valueFrom;
        const valueSet = targetInfo.valueSet;
        const disabled = targetInfo.disabled;
        const chosenItemsArray = targetInfo.chosenItemsArray;

        const displayClass = iconLink.attributes['data-displayClass'].value;
        const name = iconLink.attributes['data-id'].value
        let currentValue = curValue;
        let dialogFields = new DialogFields();

        dialogFields.putValue('replacer', iconLink.attributes['replacer'].value);
        dialogFields.putValue('id', name);
        dialogFields.putValue('displayClass', displayClass);
        dialogFields.putValue('nameLabel', iconLink.attributes['nameLabel'].value);
        dialogFields.putValue('supportsModelTokens', iconLink.attributes['supportsModelTokens'].value);
        dialogFields.putValue('supportsUnresolvedReferences', iconLink.attributes['supportsUnresolvedReferences'].value);
        dialogFields.putValue('wktTool', iconLink.attributes['wktTool'].value);
        dialogFields.putValue('supportsPropSelect', targetInfo.supportsPropSelect);
        dialogFields.putValue('supportsPropCreate', targetInfo.supportsPropCreate);
        dialogFields.putValue('pagePropVariables', targetInfo.pagePropVariables);
        dialogFields.putValue('currentValue', currentValue);
        dialogFields.putValue('onValueUpdated', targetInfo.onValueUpdated);
        dialogFields.putValue('onValueUpdatedSelectWKTVariable', targetInfo.onValueWKTVariable);
        //We need to cache this original value for the case where user changes value in the dialog
        //and then click Cancel. With this, we still need to save/honor the original value before opening the dialog.
        dialogFields.putValue('originalValue', currentValue);
        dialogFields.putValue('originalValueFrom', valueFrom);
        dialogFields.putValue('disabled', disabled);
        dialogFields.putValue('newPropName', '');
        dialogFields.putValue('newPropValue', '');

        dialogFields.putValue('valueSet', valueSet);
        dialogFields.putValue('dataId', iconLink.attributes['data-id'].value);
        dialogFields.putValue('showButtonSelected', valueFrom);
        dialogFields.putValue('pageWKTVariables', getModelPropertyNameArray.call(this));

        switch (dialogFields.displayClass){
          case 'oj-switch':
            if (valueFrom === 'fromModelToken') {
              if (dialogFields.wktTool === 'true') {
                this.setupVariableDialogFields(dialogFields, currentValue);
              } else
              if (targetInfo.supportsPropSelect) {
                this.setupPropertiesDialogFields(dialogFields, currentValue);
              } else {
                dialogFields.putValue('variableName', currentValue);
                dialogFields.putValue('showButtonSelected', 'fromModelToken');
                const prop = this.getModelPropertyBasedOnName.call(this, currentValue);
                dialogFields.putValue('variableUid', prop===null ? '' :  prop.uid );
              }
            } else {
              dialogFields.putValue('variableName', '');
              dialogFields.putValue('itemValue', currentValue);
              dialogFields.putValue('showButtonSelected', 'fromRegValue');
            }
            break;
          case 'oj-input-text':
          case 'oj-input-password':
          case 'oj-text-area':
            if (valueFrom === 'fromModelToken') {
              if (dialogFields.wktTool === 'true') {
                this.setupVariableDialogFields(dialogFields, currentValue);
              } else
              if (targetInfo.supportsPropSelect) {
                this.setupPropertiesDialogFields(dialogFields, currentValue);
              } else {
                dialogFields.putValue('variableName', currentValue);
                dialogFields.putValue('showButtonSelected', 'fromModelToken');
              }
            } else {
              dialogFields.putValue('itemValue', currentValue);
              dialogFields.putValue('showButtonSelected', 'fromRegValue');
            }
            break;
          case 'oj-select-single':
          case 'oj-combobox-one':
          case 'cfe-multi-select':
            if (valueFrom === 'fromUnresolvedReference'){
              dialogFields.putValue('unresolvedValue', currentValue);
            } else
            if (valueFrom === 'fromModelToken'){
              if (dialogFields.wktTool === 'true'){
                this.setupVariableDialogFields(dialogFields, currentValue, false);
              } else
              if (targetInfo.supportsPropSelect) {
                this.setupPropertiesDialogFields(dialogFields, currentValue);
              } else {
                dialogFields.putValue('variableName', currentValue);
                dialogFields.putValue('showButtonSelected', 'fromModelToken' );
              }
            } else{
              dialogFields.putValue('showButtonSelected', 'fromRegValue' );
              dialogFields.putValue('selectedValue', currentValue);
            }
            break;
          default:
            dialogFields.putValue('itemValue', currentValue);
            break;
        }
        return getWDTOptionsDialogDOMFragment(dialogFields);
      },

      /*
       * Determine if the Wdt dialog should be displayed.  This is being called
       * when the field value on the form is changed.
       */
      shouldShowDialog: function (globalFlag, name, newValue, inCreate){
        if (!globalFlag)
          return {shouldShow: false, from: null};

        //In create form, will popup the dialog only if user fills in string beginning with '@@'
        if (CoreUtils.isNotUndefinedNorNull(inCreate)) {
          if (typeof newValue === 'string' && !(newValue.startsWith('@@PROP:')))
            return {shouldShow: false, from: null};
        }
        //In edit, if the user selects from a dropdown of references, the newValue passed in will not be a string. In this case
        //there is no need to popup the dialog to determine if user means to enter a Model Token or Unresolved Ref.
        if (typeof newValue !== 'string'){
          return {shouldShow: false, from: 'fromRegValue'};
        }

        //Anytime user types in @@, always popup the dialog
        if (newValue.startsWith('@@PROP:') &&  newValue.endsWith('@@') && this.pdjTypes.isSupportsModelTokens(name)){
          return {shouldShow: true, from: 'fromModelToken'};
        }

        //just a regular text field. We don't show the popup if not starting with @@
        if ((!this.pdjTypes.isDynamicEnumType(name)) && !(this.pdjTypes.hasLegalValues(name)) &&
          !(newValue.startsWith('@@PROP:'))){
          return {shouldShow: false, from: 'fromRegValue'};
        }

        //In edit, if user types in something, or selects dropdown of legal value, the newValue passed in will be a String.
        // We will test if this String is one of the legal value.  If so, no need to show the dialog.
        if (this.pdjTypes.hasLegalValues(name)) {
          const oneVal = this.pdjTypes.getLegalValues(name).find(legalValue => legalValue.value === newValue);
          if (CoreUtils.isNotUndefinedNorNull(oneVal)) {
            return {shouldShow: false, from: 'fromRegValue'};
          }
        }

        //User selects the 'None' from a dropdown list of references or by making it an empty field
        if (this.pdjTypes.isDynamicEnumType(name) && newValue === ''){
          return {shouldShow: false, from: 'fromRegValue'};
        }

        if (this.pdjTypes.isDynamicEnumType(name) && (typeof newValue ==='string')){
          return {shouldShow: true, from: 'fromUnresolvedReference'};
        }

        return {shouldShow: true, from: 'fromRegValue'};
      },
      getModelArchivePaths: (properties, self) => {
        let paths = [];
        for (const property of properties) {
          if (property) {
            if (property.modelToken) {
              const variableName = property.modelToken.match(/@@PROP:(.+)@@/);
              const value = self.getModelPropertyValue(variableName[1]);
              if (CoreUtils.isNotUndefinedNorNull(value)) paths.push(value);
            }
            else if (CoreUtils.isNotUndefinedNorNull(property.value)) {
              paths.push(property.value)
            }
          }
        }
        return paths;
      },
      deleteModelArchivePaths: (dataProvider, modelArchive, signaling) => {
        if (dataProvider.modelArchivePaths) {
          dataProvider.modelArchivePaths.forEach((path) => {
            const paths = modelArchive.removeFromArchive(path);
            for (const i in paths) {
              signaling.modelArchiveUpdated.dispatch(dataProvider, {operation: 'remove', path: paths[i]});
            }
          });
          dataProvider['modelArchive'] = modelArchive.archiveRoots;
        }
      },
      deleteModelArchiveEntry: function(paths, signaling, self) {
        if (window?.api?.ipc &&
          Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
          window.api.ipc.invoke('get-archive-entry-types')
            .then(entryTypes => {
              const dataProvider = self.getDataProvider();
              dataProvider.putValue('modelArchivePaths', paths);
              const modelArchive = new ModelArchive(dataProvider.modelArchive, entryTypes);
              self.deleteModelArchivePaths(dataProvider, modelArchive, signaling);
            });
        }
      },
      /**
       * @param {object} pdjTypes - set the pdjTypes for the current page.
       */
      setPdjTypes: function (pdjTypes){
        this.pdjTypes = pdjTypes;
      }

    };

    // Return constructor function
    return WdtForm;
  }
);
