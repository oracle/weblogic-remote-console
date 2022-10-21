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
      confirmDialog.setAttribute('dialog-title', i18n.dialog.title());
      const span = document.getElementById('confirmDialogPrompt');
      span.innerHTML = i18n.dialog.prompt();
      return new Promise(function (resolve) {
        function onClose(reply) {
          yesBtn.removeEventListener('ojAction', yesClickHandler);
          noBtn.removeEventListener('ojAction', noClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function yesClickHandler(event) {
          onClose(true);
          confirmDialog.close();
        }

        function noClickHandler() {
          onClose(false);
          confirmDialog.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
              // Treat pressing the "Enter" key as clicking the "OK" button
              yesClickHandler(event);
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
            case 'Escape':
              // Treat pressing the "Escape" key as clicking the "Cancel" button
              noClickHandler();
              break;
          }
        }

        const yesBtn = document.getElementById('dlgYesBtn');
        yesBtn.addEventListener('click', yesClickHandler);

        const noBtn = document.getElementById('dlgNoBtn');
        noBtn.addEventListener('click', noClickHandler);

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.open();
      });
    }

    function showUnsavedChangesAppExitConfirmDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      confirmDialog.setAttribute('dialog-title', i18n.dialog.title());
      const span = document.getElementById('confirmDialogPrompt');
      span.innerHTML = i18n.dialog.prompt();
      const div = document.querySelector('.cfe-dialog-cancel');
      div.style.display = (i18n.buttons.cancel.visible() ? 'inline-flex' : 'none');
      return new Promise(function (resolve) {
        function onClose(reply) {
          yesBtn.removeEventListener('ojAction', yesClickHandler);
          noBtn.removeEventListener('ojAction', noClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function yesClickHandler(event) {
          onClose({exitButton: 'yes'});
          confirmDialog.close();
        }

        function noClickHandler() {
          onClose({exitButton: 'no'});
          confirmDialog.close();
        }

        function cancelClickHandler() {
          onClose({exitButton: 'cancel'});
          confirmDialog.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
              // Treat pressing the "Enter" key as clicking the "OK" button
              yesClickHandler(event);
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

        const yesBtn = document.getElementById('dlgYesBtn');
        yesBtn.addEventListener('click', yesClickHandler);

        const noBtn = document.getElementById('dlgNoBtn');
        noBtn.addEventListener('click', noClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn');
        cancelBtn.addEventListener('click', cancelClickHandler);

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.open();
      });
    }

    function showChangesNotDownloadedConfirmDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      confirmDialog.setAttribute('dialog-title', i18n.dialog.title());
      const span = document.getElementById('confirmDialogPrompt');
      span.innerHTML = i18n.dialog.prompt();
      const div = document.querySelector('.cfe-dialog-cancel');
      div.style.display = (i18n.buttons.cancel.visible() ? 'inline-flex' : 'none');
      return new Promise(function (resolve) {
        function onClose(reply) {
          yesBtn.removeEventListener('ojAction', yesClickHandler);
          noBtn.removeEventListener('ojAction', noClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function yesClickHandler(event) {
          onClose({exitButton: 'yes'});
          confirmDialog.close();
        }

        function noClickHandler() {
          onClose({exitButton: 'no'});
          confirmDialog.close();
        }

        function cancelClickHandler() {
          onClose({exitButton: 'cancel'});
          confirmDialog.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
              // Treat pressing the "Enter" key as clicking the "OK" button
              yesClickHandler(event);
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

        const yesBtn = document.getElementById('dlgYesBtn');
        yesBtn.addEventListener('click', yesClickHandler);

        const noBtn = document.getElementById('dlgNoBtn');
        noBtn.addEventListener('click', noClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn');
        cancelBtn.addEventListener('click', cancelClickHandler);

        confirmDialog.addEventListener('keyup', onKeyUp);

        confirmDialog.open();
      });
    }

    function showAbandonCreateFormDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      confirmDialog.setAttribute('dialog-title', i18n.dialog.title());
      const span = document.getElementById('confirmDialogPrompt');
      span.innerHTML = i18n.dialog.prompt();
      const div = document.querySelector('.cfe-dialog-cancel');
      div.style.display = (i18n.buttons.cancel.visible() ? 'inline-flex' : 'none');
      return new Promise(function (resolve) {
        function onClose(reply) {
          yesBtn.removeEventListener('ojAction', yesClickHandler);
          noBtn.removeEventListener('ojAction', noClickHandler);
          cancelBtn.removeEventListener('ojAction', cancelClickHandler);
          confirmDialog.removeEventListener('keyup', onKeyUp);
          resolve(reply);
        }

        function yesClickHandler(event) {
          onClose({exitButton: 'yes'});
          confirmDialog.close();
        }

        function noClickHandler() {
          onClose({exitButton: 'no'});
          confirmDialog.close();
        }

        function cancelClickHandler() {
          onClose({exitButton: 'cancel'});
          confirmDialog.close();
        }

        function onKeyUp(event) {
          switch (event.key){
            case 'Enter':
              // Treat pressing the "Enter" key as clicking the "OK" button
              yesClickHandler(event);
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

        const yesBtn = document.getElementById('dlgYesBtn');
        yesBtn.addEventListener('click', yesClickHandler);

        const noBtn = document.getElementById('dlgNoBtn');
        noBtn.addEventListener('click', noClickHandler);

        const cancelBtn = document.getElementById('dlgCancelBtn');
        cancelBtn.addEventListener('click', cancelClickHandler);

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
          case 'UnsavedChangesAppExit':
            return showUnsavedChangesAppExitConfirmDialog(i18n);
          case 'ChangesNotDownloaded':
            return showChangesNotDownloadedConfirmDialog(i18n);
          case 'AbandonCreateForm':
            return showAbandonCreateFormDialog(i18n);
        }
      }

    };

  }
);
