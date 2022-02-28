/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(
  function () {

    function showActionsDialog(dialogParams, i18n) {
      return new Promise(function (resolve, reject) {
        i18n.actionsDialog.title(dialogParams.title);
        i18n.actionsDialog.instructions(dialogParams.instructions);
        i18n.actionsDialog.buttons.ok.label(dialogParams.label);
        i18n.actionsDialog.buttons.ok.disabled(true);

        const okBtn = document.getElementById('dlgOkBtn2');
        const cancelBtn = document.getElementById('dlgCancelBtn2');
        const actionsDialog = document.getElementById('actionsDialog');

        function okClickHandler() {
          resolve({exitAction: i18n.actionsDialog.buttons.ok.label});
          actionsDialog.close();
        }
        okBtn.addEventListener('click', okClickHandler);

        function cancelClickHandler() {
          reject({exitAction: i18n.actionsDialog.buttons.cancel.label});
          actionsDialog.close();
        }
        cancelBtn.addEventListener('click', cancelClickHandler);

        function onKeyUp(event) {
          if (event.key === 'Enter') {
            // Treat pressing the "Enter" key as clicking the "OK" button
            okClickHandler();
            // Suppress default handling of keyup event
            event.preventDefault();
            // Veto the keyup event
            return false;
          }
        }

        actionsDialog.addEventListener('ojClose', function (event) {
          okBtn.removeEventListener('click', okClickHandler);
          cancelBtn.removeEventListener('click', cancelClickHandler);
        });

        actionsDialog.open();
      });
    }

  //public:
    return {
      showActionsDialog: (dialogParams, i18n) => {
        return showActionsDialog(dialogParams, i18n);
      }

    };

  }
);
