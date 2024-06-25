/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {

    function showImportProjectDialog(dialogParams, i18n) {
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

        const projectDialog = document.getElementById('importProjectDialog');
        projectDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);

        projectDialog.open();

        const ele = document.querySelector('#importProjectDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

    function showExportAllToProjectDialog(dialogParams, i18n) {
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

        const projectDialog = document.getElementById('exportProjectDialog');
        projectDialog.addEventListener('keyup', onKeyUp);

        i18n.buttons.ok.disabled(false);

        projectDialog.open();

        const ele = document.querySelector('#exportProjectDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

    function showProjectBusyDialog(i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          projectBusyDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function okClickHandler(event) {
          onClose(true);
          projectBusyDialog.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
            case 'Escape':
              okClickHandler(event);
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
          }
        }

        const okBtn = document.getElementById('dlgOkBtn18');
        okBtn.addEventListener('ojAction', okClickHandler);

        const projectBusyDialog = document.getElementById('projectBusyDialog');
        projectBusyDialog.addEventListener('keyup', onKeyUp);

        projectBusyDialog.open();

        const ele = document.querySelector('#projectBusyDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

    function correctJETControlOATBIssues() {
      const ele = document.querySelector('#projectChooserDialog_layer');
      if (ele !== null) ele.removeAttribute('aria-modal');
    }

  //public:
    return {
      /**
       * Show data provider-related dialog box associated with ``name``
       * @param {string} name
       * @param {{id: string, type?: string, accepts?: string}} dialogParams
       * @param {object} i18n
       * @returns {Promise}
       */
      showProvidersDialog: (name, dialogParams, i18n) => {
        switch (name) {
          case 'ImportProject':
            return showImportProjectDialog(dialogParams, i18n);
          case 'ExportAllToProject':
            return showExportAllToProjectDialog(dialogParams, i18n);
          case 'ProjectBusy':
            return showProjectBusyDialog(i18n);
        }
      }

    };

  }
);
