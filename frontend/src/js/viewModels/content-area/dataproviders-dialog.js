/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {

    function showDomainConnectionDialog(domainConnectionDialog, dialogParams, i18n, isUniqueDataProviderNameCallback) {
      return new Promise(function (resolve) {
        function onClose(reply) {
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

        const okBtn = document.getElementById('dlgOkBtn11');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn11');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        domainConnectionDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);
      });
    }

    function showWDTModelDialog(modelDialog, dialogParams, i18n, isUniqueDataProviderNameCallback) {
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

        modelDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);
      });
    }

    function showWDTCompositeModelDialog(modelCompositeDialog, dialogParams, i18n, isUniqueDataProviderNameCallback) {
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

        modelCompositeDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);
      });
    }

    function showImportProjectDialog(projectDialog, dialogParams, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          projectDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function onEnterKey() {
          const ojInputs = projectDialog.querySelectorAll('.cfe-dialog-field, .cfe-file-chooser-field');
          const ojInputsArray = Array.from(ojInputs);
          const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => ojInput.value !== null && ojInput.value.length > 0);
          return (ojInputs.length !== ojInputsArrayFiltered.length);
        }

        function okClickHandler(event) {
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          projectDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          projectDialog.close();
        }

        function onKeyUp(event) {
          if (event.key === 'Enter') {
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler(event);
            // Suppress default handling of keyup event
            event.preventDefault();
            // Veto the keyup event, so JET will update the knockout
            // observable associated with the <oj-input-text> element
            return false;
          }
        }

        const okBtn = document.getElementById('dlgOkBtn14');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn14');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        const fileChooser = document.getElementById('file-chooser');
        if (fileChooser !== null) {
          fileChooser.setAttribute('accepts', dialogParams.accepts);
        }

        projectDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);
      });
    }

    function showExportAllToProjectDialog(projectDialog, dialogParams, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          projectDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function onEnterKey() {
          const ojInputs = projectDialog.querySelectorAll('.cfe-dialog-field, .cfe-file-chooser-field');
          const ojInputsArray = Array.from(ojInputs);
          const ojInputsArrayFiltered = ojInputsArray.filter(ojInput => ojInput.value !== null && ojInput.value.length > 0);
          return (ojInputs.length !== ojInputsArrayFiltered.length);
        }

        function okClickHandler(event) {
          if (onEnterKey()) {
            event.preventDefault();
            return false;
          }
          onClose(true);
          projectDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          projectDialog.close();
        }

        function onKeyUp(event) {
          if (event.key === 'Enter') {
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler(event);
            // Suppress default handling of keyup event
            event.preventDefault();
            // Veto the keyup event, so JET will update the knockout
            // observable associated with the <oj-input-text> element
            return false;
          }
        }

        const okBtn = document.getElementById('dlgOkBtn13');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn13');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        const fileChooser = document.getElementById('file-chooser');
        if (fileChooser !== null) {
          fileChooser.setAttribute('accepts', dialogParams.accepts);
        }

        projectDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);
      });
    }

    function showProjectChooserDialog(projectChooserDialog, dialogParams, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          projectChooserDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function okClickHandler(event) {
          onClose(true);
          projectChooserDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          projectChooserDialog.close();
        }

        function onKeyUp(event) {
          if (event.key === 'Enter') {
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler(event);
            // Suppress default handling of keyup event
            event.preventDefault();
            // Veto the keyup event, so JET will update the knockout
            // observable associated with the <oj-input-text> element
            return false;
          }
        }

        const okBtn = document.getElementById('dlgOkBtn15');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn15');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        projectChooserDialog.addEventListener('keyup', onKeyUp);
      });
    }

    function showStartupTaskChooserDialog(startupTaskChooserDialog, dialogParams, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          startupTaskChooserDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function okClickHandler(event) {
          onClose(true);
          startupTaskChooserDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          startupTaskChooserDialog.close();
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

        const okBtn = document.getElementById('dlgOkBtn16');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn16');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);

        startupTaskChooserDialog.addEventListener('keyup', onKeyUp);
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
      showDataProvidersDialog: (name, dialogParams, i18n, isUniqueDataProviderNameCallback) => {
        let rtnval;
        switch (name) {
          case 'AddAdminServerConnection':
          case 'EditAdminServerConnection': {
            const domainConnectionDialog = document.getElementById('domainConnectionDialog');
            rtnval = showDomainConnectionDialog(domainConnectionDialog, dialogParams, i18n, isUniqueDataProviderNameCallback);
            domainConnectionDialog.open();
          }
            break;
          case 'AddPropertyList':
          case 'EditPropertyList':
          case 'AddWDTModel':
          case 'EditWDTModel': {
            const modelDialog = document.getElementById('modelDialog');
            rtnval = showWDTModelDialog(modelDialog, dialogParams, i18n, isUniqueDataProviderNameCallback);
            modelDialog.open();
          }
            break;
          case 'AddWDTCompositeModel':
          case 'EditWDTCompositeModel': {
            const modelCompositeDialog = document.getElementById('modelCompositeDialog');
            rtnval = showWDTCompositeModelDialog(modelCompositeDialog, dialogParams, i18n, isUniqueDataProviderNameCallback);
            modelCompositeDialog.open();
          }
            break;
          case 'ImportProject': {
            const projectDialog = document.getElementById('importProjectDialog');
            rtnval = showImportProjectDialog(projectDialog, dialogParams, i18n);
            projectDialog.open();
          }
            break;
          case 'ExportAllToProject': {
            const projectDialog = document.getElementById('exportProjectDialog');
            rtnval = showExportAllToProjectDialog(projectDialog, dialogParams, i18n);
            projectDialog.open();
          }
            break;
          case 'ProjectChooser': {
            const projectChooserDialog = document.getElementById('projectChooserDialog');
            rtnval = showProjectChooserDialog(projectChooserDialog, dialogParams, i18n);
            projectChooserDialog.open();
          }
            break;
          case 'StartupTaskChooser': {
            const startupTaskChooserDialog = document.getElementById('startupTaskChooserDialog');
            rtnval = showStartupTaskChooserDialog(startupTaskChooserDialog, dialogParams, i18n);
            startupTaskChooserDialog.open();
          }
            break;
        }
        return rtnval;
      }

    };

  }
);
