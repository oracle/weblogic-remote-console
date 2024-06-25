/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout','wrc-frontend/integration/viewModels/utils'],
  function (ko, ViewModelUtils) {

    function showDomainConnectionDialog(dialogParams, i18n, isUniqueDataProviderNameCallback) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          insecureCheckbox.removeEventListener('change', insecureClickHandler);
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          domainConnectionDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function onEnterKey() {
          const ojInputs = domainConnectionDialog.querySelectorAll('.cfe-dialog-field, .cfe-file-chooser-field');
          const ojInputsArray = Array.from(ojInputs);
          const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => ojInput.value !== null && ojInput.value.length > 0);
          return (ojInputs.length !== ojInputsArrayFiltered.length);
        }

        function okClickHandler(event) {
          if (!isUniqueDataProviderNameCallback('connection-response-message')) {
            event.preventDefault();
            return false;
          }
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          domainConnectionDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          domainConnectionDialog.close();
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

        function insecureClickHandler() {
          dialogParams.insecure = (insecureCheckbox.checked ? [insecureCheckbox.value] : []);
        }

        function insecureSetup() {
          insecureCheckbox.checked = (dialogParams.insecure.length > 0);
          insecureCheckbox.addEventListener('change', insecureClickHandler);
        }

        const domainConnectionDialog = document.getElementById('domainConnectionDialog');
        domainConnectionDialog.setAttribute('data-provider-type', dialogParams.help.providerType);

        const insecureCheckbox = document.getElementById('insecure-checkbox');
        insecureSetup();

        const okBtn = document.getElementById('dlgOkBtn11');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn11');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        domainConnectionDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);

        domainConnectionDialog.open();

        const ele = document.querySelector('#domainConnectionDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

    function showWDTModelDialog(dialogParams, i18n, isUniqueDataProviderNameCallback) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          modelDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function onEnterKey() {
          const ojInputs = modelDialog.querySelectorAll('.cfe-dialog-field, .cfe-file-chooser-field');
          const ojInputsArray = Array.from(ojInputs);
          // Allow for a field of the dialog to be designated as optional
          const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => {
            return ((ojInput.value !== null && ojInput.value.length > 0) ||
              ojInput.classList.contains('cfe-dialog-field-optional'));
          });
          return (ojInputs.length !== ojInputsArrayFiltered.length);
        }

        function okClickHandler(event) {
          if (!isUniqueDataProviderNameCallback('model-response-message')) {
            event.preventDefault();
            return false;
          }
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          modelDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          modelDialog.close();
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

        const okBtn = document.getElementById('dlgOkBtn12');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn12');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        const fileChooser = document.getElementById('file-chooser');
        if (fileChooser !== null) {
          fileChooser.setAttribute('accepts', dialogParams.accepts);
        }

        const modelDialog = document.getElementById('modelDialog');
        modelDialog.setAttribute('data-provider-type', dialogParams.help.providerType);

        modelDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);

        modelDialog.open();

        const ele = document.querySelector('#modelDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

    function showWDTCompositeModelDialog(dialogParams, i18n, isUniqueDataProviderNameCallback) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          modelCompositeDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function onEnterKey() {
          const ojInputs = modelCompositeDialog.querySelectorAll('.cfe-dialog-field, .cfe-file-chooser-field');
          const ojInputsArray = Array.from(ojInputs);
          const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => ojInput.value !== null && ojInput.value.length > 0);
          return (ojInputs.length !== ojInputsArrayFiltered.length);
        }

        function okClickHandler(event) {
          if (!isUniqueDataProviderNameCallback('model-composite-response-message')) {
            event.preventDefault();
            return false;
          }
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          modelCompositeDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          modelCompositeDialog.close();
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

        const okBtn = document.getElementById('dlgOkBtn17');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn17');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        const modelCompositeDialog = document.getElementById('modelCompositeDialog');
        modelCompositeDialog.setAttribute('data-provider-type', dialogParams.help.providerType);

        modelCompositeDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);

        modelCompositeDialog.open();

        const ele = document.querySelector('#modelCompositeDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

  //public:
    return {
      /**
       * Show data provider-related dialog box associated with ``name``
       * @param {string} name
       * @param {{id: string, type?: string, accepts?: string}} dialogParams
       * @param {object} i18n
       * @param {function} isUniqueDataProviderNameCallback?
       * @returns {Promise}
       */
      showProvidersDialog: (name, dialogParams, i18n, isUniqueDataProviderNameCallback) => {
        switch (name) {
          case 'AddAdminServerConnection':
          case 'EditAdminServerConnection':
            return showDomainConnectionDialog(dialogParams, i18n, isUniqueDataProviderNameCallback);
          case 'AddPropertyList':
          case 'EditPropertyList':
            return showWDTModelDialog(dialogParams, i18n, isUniqueDataProviderNameCallback);
          case 'AddWDTModel':
          case 'EditWDTModel':
            return showWDTModelDialog(dialogParams, i18n, isUniqueDataProviderNameCallback);
          case 'AddWDTCompositeModel':
          case 'EditWDTCompositeModel':
            return showWDTCompositeModelDialog(dialogParams, i18n, isUniqueDataProviderNameCallback);
        }
      },

      /**
       * Update the connection dialog fields that depended on the SSO state
       *
       * @param {boolean} ssoEnabled - The current SSO setting value
       */
      updateSsoDependentFields: (ssoEnabled = false) => {
        const classDialogField = 'cfe-dialog-field';
        const ssoDepdendentFields = [];
        ssoDepdendentFields.push(document.getElementById('username-field'));
        ssoDepdendentFields.push(document.getElementById('password-field'));
        ssoDepdendentFields.forEach((field) => {
          if (field != null) {
            field.disabled = ssoEnabled;
            if (!ssoEnabled) field.classList.add(classDialogField);
            else field.classList.remove(classDialogField);
          }
        });
      }

    };

  }
);