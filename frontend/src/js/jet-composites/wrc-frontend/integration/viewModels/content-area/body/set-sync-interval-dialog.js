/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(
  function () {

    function showSetSyncInterval(currentValue, i18n) {
      return new Promise(function (resolve, reject) {
        // The dialog will contain current value when sync interval is set
        if (parseInt(currentValue) > 0) i18n.dialogSync.fields.interval.value(currentValue);

        const okBtn = document.getElementById('dlgOkBtn1');
        const cancelBtn = document.getElementById('dlgCancelBtn1');
        const inputText = document.getElementById('interval-field');
        const dialogSync = document.getElementById('syncIntervalDialog');

        // Check the specified sync interval where anything other
        // than a positive value returns zero for the saved value
        function sanityCheckInput(syncInterval) {
          if (syncInterval === '')
            syncInterval = '0';
          else {
            const value = parseInt(syncInterval);
            if (isNaN(value)) {
              syncInterval = '0';
            }
            else {
              syncInterval = (value <= 0 ? '0' : `${value}`);
            }
          }
          return syncInterval;
        }

        function okClickHandler() {
          const inputValue = i18n.dialogSync.fields.interval.value();
          const syncInterval = sanityCheckInput(inputValue);
          resolve({exitAction: i18n.buttons.ok.label, interval: syncInterval});
          dialogSync.close();
        }
        okBtn.addEventListener('click', okClickHandler);

        function cancelClickHandler() {
          reject({exitAction: i18n.buttons.cancel.label, interval: currentValue});
          dialogSync.close();
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
        inputText.addEventListener('keyup', onKeyUp);

        dialogSync.addEventListener('ojClose', function (event) {
          okBtn.removeEventListener('click', okClickHandler);
          cancelBtn.removeEventListener('click', cancelClickHandler);
          inputText.removeEventListener('keyup', onKeyUp);
        });

        dialogSync.open();
      });
    }

  //public:
    return {
      showSetSyncIntervalDialog: (currentValue, i18n) => {
        return showSetSyncInterval(currentValue, i18n);
      }

    };

  }
);
