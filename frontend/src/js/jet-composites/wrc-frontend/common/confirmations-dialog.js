/**
 * @license
 * Copyright (c) 2024 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {

    function showAdminServerShutdownConfirmDialog(i18n) {
      const confirmDialog = document.getElementById('confirmDialog');
      confirmDialog.setAttribute('dialog-title', i18n.dialog.title());
      const span = document.getElementById('confirmDialogPrompt');
      span.innerHTML = i18n.dialog.prompt();
      const cancelButton = document.querySelector('.cfe-dialog-cancel');
      cancelButton.style.display = (i18n.buttons.cancel.visible() ? 'inline-flex' : 'none');
      if (cancelButton.style.display === 'inline-flex') cancelButton.focus();
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
        if (name === 'ShutdownAdminServer') {
          return showAdminServerShutdownConfirmDialog(i18n);
        }
      }

    };

  }
);
