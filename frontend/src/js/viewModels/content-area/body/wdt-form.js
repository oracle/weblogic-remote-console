/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'knockout', '../../../microservices/provider-management/data-provider-manager', '../../utils', '../../../core/utils', 'ojs/ojlogger'],
  function (oj, ko, DataProviderManager, ViewModelUtils, CoreUtils, Logger) {

    const i18n = {
      "messages": {
        "changesSaved": {"summary": oj.Translations.getTranslatedString("wrc-wdt-form.messages.changesSaved.summary", "{0}")},
        "changesNotSaved": {"summary": oj.Translations.getTranslatedString("wrc-wdt-form.messages.changesNotSaved.summary", "{0}")},
        "changesDownloaded": {"summary": oj.Translations.getTranslatedString("wrc-wdt-form.messages.changesDownloaded.summary", "{0}")},
        "changesNotDownloaded": {"summary": oj.Translations.getTranslatedString("wrc-wdt-form.messages.changesNotDownloaded.summary", "{0}")}
      },
      "wdtOptionsDialog": {
        "instructions": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.instructions"),
        "default": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.default"),
        "enterValue": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.enterValue"),
        "selectValue": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.selectValue"),
        "selectSwitch": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.selectSwitch"),
        "enterUnresolvedReference": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.enterUnresolvedReference"),
        "enterModelToken": oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.enterModelToken")
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
      const title = oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.title", "{0}");
      const result = {title: title.replace("{0}", dialogFields.nameLabel)};

      const displayClass = dialogFields.displayClass;
      let inputLabel = i18n.wdtOptionsDialog.enterValue;
      if(displayClass === 'oj-select-single' || displayClass === 'oj-combobox-one'){
        inputLabel = i18n.wdtOptionsDialog.selectValue;
      }
      if(displayClass === 'oj-switch'){
        inputLabel = i18n.wdtOptionsDialog.selectSwitch;
      }

      const radioEnter = "[[buttonSelected() === 'fromRegValue' ]]";
      const radioModelToken = "[[buttonSelected() === 'fromModelToken']]";
      const radioRef = "[[buttonSelected() === 'fromUnresolvedReference' ]]";

      let dialogDom = "<br/>";
      dialogDom += "<oj-radioset id='radio_" + dialogFields.id + "' value='{{buttonSelected}}' ";
      dialogDom += (dialogFields.disabled) ? "disabled=true>" : ">";
      if ( (CoreUtils.isUndefinedOrNull(dialogFields.valueSet)) || (dialogFields.valueSet === true)) {
        dialogDom += "<oj-option value='restoreToDefault'>" + i18n.wdtOptionsDialog.default + "</oj-option>";
      }

      dialogDom += "<oj-option value='fromRegValue'>" + inputLabel + "</oj-option>";
      dialogDom += "<oj-bind-if test=\"" + radioEnter +"\">";

      const addDisable =  (dialogFields.disabled) ? " disabled=true " : "";
      switch(displayClass) {
        case "oj-select-single":
        case "oj-combobox-one":
          dialogDom += "      <div> <oj-select-single id='select_" + dialogFields.id + "'";
          dialogDom += "      class='cfe-form-input-single-column' ";
          dialogDom += "      data='[[fieldSelectData_" + dialogFields.dataId +"]]'";
          dialogDom += addDisable;
          dialogDom += "      value='{{dialogFields().currentValue}}'></oj-select-single> </div>";
          break;
        case "oj-switch":
          dialogDom += "      <div><oj-switch id='switch_'" + dialogFields.id + "'";
          dialogDom += addDisable;
          dialogDom += "      value='{{dialogFields().currentValue}}'></oj-switch> </div>";
          break;
        case "oj-input-text":
          dialogDom += "      <div><oj-input-text id='text_" + dialogFields.id + "'";
          dialogDom += "      class='cfe-form-input-single-column' ";
          dialogDom += addDisable;
          dialogDom += "      value='{{dialogFields().currentValue}}' ></oj-input-text></div>";
          break;
        case "oj-text-area":
          dialogDom += "      <div><oj-text-area id='textarea_" + dialogFields.id + "'";
          dialogDom += "      class='cfe-form-input-single-column' ";
          dialogDom += addDisable;
          dialogDom += "      value='{{dialogFields().currentValue}}' ></oj-text-area></div>";
          break;
        case "oj-input-password":
          dialogDom += "      <div><oj-input-password id='text_" + dialogFields.id + "'";
          dialogDom += "      class='cfe-form-input-single-column' ";
          dialogDom += "      mask-icon='visible' ";
          dialogDom += addDisable;
          dialogDom += "      value='{{dialogFields().currentValue}}' ></oj-input-password></div>";
          break;
      }

      dialogDom += "</oj-bind-if>";

      if (dialogFields.supportsModelTokens === 'true'){
        dialogDom += "<oj-option value='fromModelToken'>" +i18n.wdtOptionsDialog.enterModelToken +"</oj-option>";
        dialogDom += "<oj-bind-if test=\"" + radioModelToken + "\">";
        if (displayClass === "oj-input-password"){
          dialogDom += "<oj-bind-if test=\"" + radioModelToken + "\">";
          dialogDom += "      <div><oj-input-password id='text_" + dialogFields.id + "'";
          dialogDom += "    class='cfe-form-input-single-column' ";
          dialogDom += addDisable;
          dialogDom += "      mask-icon='visible' ";
          dialogDom += "      value='{{dialogFields().currentValue}}' ></oj-input-password></div>";
        }else
        {
          dialogDom += "    <div><oj-input-text id='text_" + dialogFields.id + "'";
          dialogDom += "    placeholder='@@PROP:KEY@@'";
          dialogDom += addDisable;
          dialogDom += "    class='cfe-form-input-single-column' ";
          dialogDom += "    value='{{dialogFields().currentValueText}}' ></oj-input-text></div>";
        }
        dialogDom += "</oj-bind-if>";
      }
      if (dialogFields.supportsUnresolvedReferences === 'true'){
        dialogDom += "<oj-option value='fromUnresolvedReference'>" +i18n.wdtOptionsDialog.enterUnresolvedReference +"</oj-option>";
        dialogDom += "<oj-bind-if test=\"" + radioRef + "\">";
        dialogDom += "    <div><oj-input-text id='text_" + dialogFields.id + "'";
        dialogDom += "    class='cfe-form-input-single-column' ";
        dialogDom += addDisable;
        dialogDom += "    value='{{dialogFields().currentValueText}}' ></oj-input-text></div>";
        dialogDom += "</oj-bind-if>";
      }
      dialogDom += "</oj-radioset>";
      dialogDom += "<br><br>";

      Logger.log(`[WDTFORM] dialogDom=${dialogDom}`);
      result["html"] = dialogDom;
      result["fields"] = dialogFields;

      return result;
    }

    /**
     *
     * @param {DialogFields} dialogFields
     * @returns {{title: string, html: string, fields: *}}
     * @private
     */
    function createWDTOptionsDialogDOMFragmentMultiSelect(dialogFields)
    {
      const title = oj.Translations.getTranslatedString("wrc-wdt-form.wdtOptionsDialog.title", "{0}");
      const result = {title: title.replace("{0}", dialogFields.nameLabel)};

      const radioModelToken = "[[buttonSelected() === 'fromModelToken']]";
      const radioRef = "[[buttonSelected() === 'fromUnresolvedReference' ]]";

      let dialogDom = "";
      dialogDom +=  "<div className='cfe-dialog-prompt'>";
      dialogDom +=  "<span>" + i18n.wdtOptionsDialog.instructions +"</span>";
      dialogDom +=  "</div><br/>";

      dialogDom += "<oj-radioset id='radio_" + dialogFields.id + "' value='{{buttonSelected}}'>" ;
      if (dialogFields.supportsModelTokens === "true"){
        dialogDom += "<oj-option value='fromModelToken'>" + i18n.wdtOptionsDialog.enterModelToken +"</oj-option>";
        dialogDom += "<oj-bind-if test=\"" + radioModelToken + "\">";
        dialogDom += "    <div><oj-input-text id='text_" + dialogFields.id + "'";
        dialogDom += "    class='cfe-form-input-single-column' ";
        dialogDom += "    placeholder='@@PROP:KEY@@'";
        dialogDom += "    value='{{dialogFields().currentValueText}}' ></oj-input-text></div>";
        dialogDom += "</oj-bind-if>";
      }
      if (dialogFields.supportsUnresolvedReferences === "true"){
        dialogDom += "<oj-option value='fromUnresolvedReference'>" +i18n.wdtOptionsDialog.enterUnresolvedReference +"</oj-option>";
        dialogDom += "<oj-bind-if test=\"" + radioRef + "\">";
        dialogDom += "    <div><oj-input-text id='text_" + dialogFields.id + "'";
        dialogDom += "    class='cfe-form-input-single-column' ";
        dialogDom += "    value='{{dialogFields().currentValueText}}' ></oj-input-text></div>";
        dialogDom += "</oj-bind-if>";
      }
      dialogDom += "</oj-radioset>";
      dialogDom += "<br/>";

      Logger.log(`[WDTFORM] Multiselect] dialogDom=${dialogDom}`);

      result["html"] = dialogDom;
      result["fields"] = dialogFields;

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
        function okClickHandler(event) {
          onClose(true);
          dialog.close();
        }
        function cancelClickHandler() {
          onClose(false);
          dialog.close();
        }
        function onKeyUp(event) {
          if (event.key === 'Escape'){
            // Treat pressing the "Escape" key as clicking the "Cancel" button
            cancelClickHandler();
          }
          else if (event.key === 'Enter' && !ignoreReturn){
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler(event);
            // Suppress default handling of keyup event.
            event.preventDefault();
            // Veto the keyup event, so JET will update the knockout
            // observable associated with the <oj-input-text> element
            return false;
          }
        }
        const okBtn = document.getElementById("dlgOkBtn22");
        okBtn.addEventListener('ojAction', okClickHandler);
        const cancelBtn = document.getElementById("dlgCancelBtn22");
        cancelBtn.addEventListener('ojAction', cancelClickHandler);
        dialog.addEventListener('keyup', onKeyUp);
      });
    }

    function dispatchElectronApiSignal(channel, data) {
      return window.electron_api.ipc.invoke(channel, data);
    }

    /**
     * Nested class for setting and capturing the value of fields, used in a dialog box.
     * @returns {{addField: addField, putValue: putValue}}
     * @constructor
     */
    function DialogFields() {
      return {
        addField: function(name, value) {
          if (typeof value === "number") value = value.toString();
          this.putValue(name, value || '');
        },
        putValue: function(name, value) {
          this[name] = value;
        }
      }
    }

  //public:
    WdtForm.prototype = {
      /**
       * Returns a reference to the ``DataProvider`` instance associated with this instance of the ``WdtForm`` class.
       * @returns {undefined|DataProvider}
       */
      getDataProvider: function() {
        return DataProviderManager.getDataProviderById(this.viewParams.beanTree.provider.id);
      },
      /**
       * Returns a Promise containing an object with information and data, which relates to the changes the CBE has for a WDT model.
       * <p>If the ``window.electron_api`` is available, the returned information and data are used to write to the actual WDT model file. Otherwise, the caller can use the returned information and data to subsequently call ``writeModelFile``.</p>
       * @returns {Promise<{succeeded: boolean, filepath: string, fileContents: string}>}
       */
      getModelFileChanges: function() {
        const dataProvider = this.getDataProvider();
        return DataProviderManager.downloadWDTModel(dataProvider)
          .then(reply => {
            if (ViewModelUtils.isElectronApiAvailable()) {
              // We're running as an Electron app, so use the
              // window.electron_api to write the model changes
              // retrieved from the CBE, to the actual model file.
              return dispatchElectronApiSignal("file-writing", {filepath: dataProvider.file, fileContents: reply.body.data});
            }
            else {
              // We're not running as an Electron app, so just
              // return Promise fulfillment containing false
              // (to indicate that the model changes retrieved
              // from the CBE we're written to a file), filepath
              // and fileContents. The caller will be able to
              // use these to subsequently call writeModelFile().
              return Promise.resolve({succeeded: false, filepath: dataProvider.file, fileContents: reply.body.data});
            }
          });
      },
      /**
       *
       * @param {{filepath: string, fileContents: string}} options
       * @returns {Promise<{succeeded: boolean}>}
       */
      writeModelFile: function (options){
        return new Promise(function (resolve) {
          options["mediaType"] = "application/x-yaml";
          ViewModelUtils.downloadFile(options);
          resolve({succeeded: true});
        });
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
          return "fromRegValue";
        }
        //if the field has legalValue, even if the input doesn't start with @@, we show as from Model Token so
        //user can change it, since in this case, there is only dropdown and model token in the dialog.
        if (typeof fieldValue === "string"){
          if (fieldValue.startsWith("@@")) {
            return "fromModelToken";
          }
          if (this.pdjTypes.hasLegalValues(name)) {
            const oneVal = this.pdjTypes.getLegalValues(name).find(legalValue => legalValue.value === fieldValue);
            if (CoreUtils.isUndefinedOrNull(oneVal)) {
              return "fromModelToken";
            }
          }
          if ( this.pdjTypes.isSupportsUnresolvedReferences(name) && !fieldValue.startsWith("@@") && fieldValue !== ""){
            return "fromUnresolvedReference";
          }
        }
        return "fromRegValue";
      },
      /**
       * Returns translated string of summary line, for message with a given``messageKey``.
       * @param {string} messageKey - The key associated with the summary line.
       * @returns {string}
       * @example
       * const summary = self.wdtForm.getSummaryMessage("changesWritten");
       */
      getSummaryMessage: function(messageKey) {
        const dataProvider = this.getDataProvider();
        return i18n.messages[messageKey].summary.replace("{0}", dataProvider["file"]);
      },
      /*
       * @param {fieldName} fieldName - changed field name.
       * @param {fieldValue} fieldValue - new value.
       * @returns {{title: string, html: string, fields: {DialogFields}}}
       */
      formFieldValueChanged: function (fieldName, fieldValue) {
        let iconLink = document.getElementById("wdtOptions_" + fieldName);
        let targetInfo = {
          iconLink: iconLink,
          curValue: fieldValue,
          valueFrom: this.calValueFrom(fieldName, fieldValue),
          valueSet: true
        };
        return this.createWdtOptionsDialog(targetInfo) ;
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
        const dialog = document.getElementById("wdtOptionsDialog");
        dialog.setAttribute("fromFieldChange", fromFieldChange);
        dialog.open();
        return displayWDTOptionsDialog(dialog, ignoreReturn);
      },
      /**
       *
       * @param {DialogFields} dialogFields
       * @returns {{title: string, html: string, fields: {DialogFields}}}
       */
      getWDTOptionsDialogDOMFragment: function(dialogFields) {
        if (dialogFields.displayClass === "cfe-multi-select") {
          return createWDTOptionsDialogDOMFragmentMultiSelect(dialogFields);
        }
        else {
          return createWDTOptionsDialogDOMFragment(dialogFields);
        }
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

        const displayClass = iconLink.attributes['data-displayClass'].value;
        const name = iconLink.attributes['data-id'].value
        let currentValue = "";
        if (displayClass !== "cfe-multi-select") {
          currentValue = curValue;
        }
        let dialogFields = new DialogFields();

        dialogFields.putValue("replacer", iconLink.attributes['replacer'].value);
        dialogFields.putValue("id", name);
        dialogFields.putValue("displayClass", displayClass);
        dialogFields.putValue("nameLabel", iconLink.attributes["nameLabel"].value);
        dialogFields.putValue("supportsModelTokens", iconLink.attributes["supportsModelTokens"].value);
        dialogFields.putValue("supportsUnresolvedReferences", iconLink.attributes["supportsUnresolvedReferences"].value);
        dialogFields.putValue("currentValue", currentValue);
        //We need to cache this original value for the case where user changes value in the dialog
        //and then click Cancel. With this, we still need to save/honor the original value before opening the dialog.
        dialogFields.putValue("originalValue", currentValue);
        dialogFields.putValue("originalValueFrom", valueFrom);
        dialogFields.putValue("disabled", disabled);

        if (displayClass !== "cfe-multi-select") {
          dialogFields.putValue("valueSet", valueSet);
          dialogFields.putValue("dataId", iconLink.attributes["data-id"].value);
          if (valueFrom  === "fromRegValue") {
            dialogFields.putValue("currentValueText", "");
          } else {
            dialogFields.putValue("currentValueText", currentValue);
          }
          //special handling for boolean.
          if ((displayClass === "oj-switch") && (valueFrom === "fromModelToken")) {
            dialogFields.putValue("currentValueText", currentValue);
            dialogFields.putValue("currentValue", true); //just some value for the switch.
          }
          dialogFields.putValue("showButtonSelected", valueFrom);
        } else
          dialogFields.putValue("showButtonSelected", "fromModelToken");

        return this.getWDTOptionsDialogDOMFragment(dialogFields);
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
          if (typeof newValue === 'string' && ! newValue.startsWith('@@'))
            return {shouldShow: false, from: null};
        }
        //In edit, if the user selects from a dropdown of references, the newValue passed in will not be a string. In this case
        //there is no need to popup the dialog to determine if user means to enter a Model Token or Unresolved Ref.
        if (typeof newValue !== 'string'){
          return {shouldShow: false, from: "fromRegValue"};
        }

        //Anytime user types in @@, always popup the dialog
        if (newValue.startsWith('@@') && this.pdjTypes.isSupportsModelTokens(name)){
          return {shouldShow: true, from: "fromModelToken"};
        }

        //just a regular text field. We don't show the popup if not starting with @@
        if ((!this.pdjTypes.isDynamicEnumType(name)) && !(this.pdjTypes.hasLegalValues(name)) &&
          !(newValue.startsWith("@@"))){
          return {shouldShow: false, from: "fromRegValue"};
        }

        //In edit, if user types in something, or selects dropdown of legal value, the newValue passed in will be a String.
        // We will test if this String is one of the legal value.  If so, no need to show the dialog.
        if (this.pdjTypes.hasLegalValues(name)) {
          const oneVal = this.pdjTypes.getLegalValues(name).find(legalValue => legalValue.value === newValue);
          if (CoreUtils.isNotUndefinedNorNull(oneVal)) {
            return {shouldShow: false, from: "fromRegValue"};
          }
        }

        //User selects the 'None' from a dropdown list of references or by making it an empty field
        if (this.pdjTypes.isDynamicEnumType(name) && newValue === ""){
          return {shouldShow: false, from: "fromRegValue"};
        }

        return {shouldShow: true, from: null};
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