/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {

    function showAboutDialog(dialogParams, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          aboutDialog.close();
          resolve(reply);
        }
        
        const aboutDialog = document.getElementById('aboutDialog');

        aboutDialog.onkeyup = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onClose(true);
          }
        };
  
        aboutDialog.onblur = (event) => {
          event.preventDefault();
          onClose(true);
        };
        
        aboutDialog.open();
      });
    }

    function showExportAsDialog(dialogParams, i18n) {
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          exportTableAsDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }
      
        function onEnterKey() {
          const ojInputs = exportTableAsDialog.querySelectorAll('.cfe-dialog-field, .cfe-file-chooser-field');
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
          exportTableAsDialog.close();
        }
      
        function cancelClickHandler() {
          onClose(false);
          exportTableAsDialog.close();
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
      
        const okBtn = document.getElementById('dlgOkBtn20');
        okBtn.addEventListener('ojAction', okClickHandler);
      
        const cancelBtn = document.getElementById('dlgCancelBtn20');
        cancelBtn.addEventListener('ojAction', cancelClickHandler);
      
        const fileChooser = document.getElementById('file-chooser');
        if (fileChooser !== null) {
          fileChooser.setAttribute('accepts', dialogParams.accepts);
        }
        
        const exportTableAsDialog = document.getElementById('exportTableAsDialog');
        exportTableAsDialog.addEventListener('keyup', onKeyUp);
      
        i18n.buttons.ok.disabled(false);
  
        exportTableAsDialog.open();
      });
    }

  //public:
    return {
      /**
       * Show appMenu-related dialog box associated with ``name``
       * @param {string} name
       * @param {{id: string, type?: string, accepts?: string}} dialogParams
       * @param {object} i18n
       * @returns {Promise}
       */
      showAppMenuDialog: (name, dialogParams, i18n) => {
        if (name === 'About') {
          return showAboutDialog(dialogParams, i18n);
        }
        else if (name === 'ExportTableAs') {
          return showExportAsDialog(dialogParams, i18n);
        }
      }
      
    };
    
  }
);
