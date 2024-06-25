/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {
    function showDialog(startupTaskChooserDialog, dialogParams, i18n) {
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

        startupTaskChooserDialog.open();

        const ele = document.querySelector('#startupTaskChooserDialog_layer');
        if (ele !== null) ele.removeAttribute('aria-modal');
      });
    }

  //public:
    return {
      showStartupTaskChooserDialog: (dialogParams, i18n) => {
        const startupTaskChooserDialog = document.getElementById('startupTaskChooserDialog');
        return showDialog(startupTaskChooserDialog, dialogParams, i18n);
      }
    };

  }
);
