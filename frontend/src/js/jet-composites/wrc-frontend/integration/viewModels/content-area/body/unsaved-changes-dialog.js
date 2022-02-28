/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {

    function showAbandonUnsavedChangesConfirmDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      return new Promise(function (resolve) {
        const okBtn = document.getElementById('dlgYesBtn');
        const cancelBtn = document.getElementById('dlgNoBtn');

        function okClickHandler() {
          resolve(true);
          confirmDialog.close();
        }

        okBtn.addEventListener('click', okClickHandler);

        function cancelClickHandler() {
          resolve(false);
          confirmDialog.close();
        }

        cancelBtn.addEventListener('click', cancelClickHandler);

        function onKeyUp(event) {
          if (event.key === 'Enter') {
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler();
            // Suppress default handling of keyup event
            event.preventDefault();
            // Veto the keyup event, so JET will update the knockout
            // observable associated with the <oj-input-text> element
            return false;
          }
        }

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.addEventListener('ojClose', (event) => {
          okBtn.removeEventListener('click', okClickHandler);
          cancelBtn.removeEventListener('click', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          // No-op if promise already resolved (like when 'OK' is clicked)
          resolve(false);
        });

        confirmDialog.open();
      });
    }

    function showUnsavedChangesDetectedConfirmDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      return new Promise(function (resolve) {
        const okBtn = document.getElementById('dlgYesBtn');
        const cancelBtn = document.getElementById('dlgNoBtn');

        function okClickHandler() {
          resolve(true);
          confirmDialog.close();
        }

        okBtn.addEventListener('click', okClickHandler);

        function cancelClickHandler() {
          resolve(false);
          confirmDialog.close();
        }

        cancelBtn.addEventListener('click', cancelClickHandler)

        function onKeyUp(event) {
          if (event.key === 'Enter') {
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler();
            // Suppress default handling of keyup event
            event.preventDefault();
            // Veto the keyup event, so JET will update the knockout
            // observable associated with the <oj-input-text> element
            return false;
          }
        }

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.addEventListener('ojClose', function (event) {
          okBtn.removeEventListener('click', okClickHandler);
          cancelBtn.removeEventListener('click', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          // No-op if promise already resolved (like when 'OK' is clicked)
          resolve(false);
        });

        confirmDialog.open();
      });
    }

    function showChangesNotDownloadedConfirmDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      return new Promise(function (resolve) {
        function onClose(reply) {
          okBtn.removeEventListener('ojAction', okClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function okClickHandler(event) {
          onClose(true);
          confirmDialog.close();
        }

        function cancelClickHandler() {
          onClose(false);
          confirmDialog.close();
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

        const okBtn = document.getElementById('dlgYesBtn');
        okBtn.addEventListener('ojAction', okClickHandler);

        const cancelBtn = document.getElementById('dlgNoBtn');
        cancelBtn.addEventListener('ojAction', cancelClickHandler)

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.open();
      });
    }

  //public:
    return {
      showConfirmDialog: (name, i18n) => {
        switch (name) {
          case 'AbandonUnsavedChanges':
            return showAbandonUnsavedChangesConfirmDialog(i18n);
          case 'UnsavedChangesDetected':
            return showUnsavedChangesDetectedConfirmDialog(i18n);
          case 'ChangesNotDownloaded':
            return showChangesNotDownloadedConfirmDialog(i18n);
        }
      }

    };

  }
);
